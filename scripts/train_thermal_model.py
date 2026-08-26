"""Train and evaluate a reproducible Random Forest thermal model from a table."""
from __future__ import annotations
import argparse
from pathlib import Path
import json
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import GroupShuffleSplit, train_test_split


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--features", nargs="+", required=True)
    parser.add_argument("--group", help="Optional spatial group column to reduce spatial leakage")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    data = pd.read_csv(args.input).dropna(subset=[args.target, *args.features])
    if args.group and args.group not in data.columns:
        raise SystemExit(f"Spatial group column not found: {args.group}")
    x, y = data[args.features], data[args.target]
    if args.group:
        splitter = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=args.seed)
        train_idx, test_idx = next(splitter.split(x, y, groups=data[args.group]))
        x_train, x_test, y_train, y_test = x.iloc[train_idx], x.iloc[test_idx], y.iloc[train_idx], y.iloc[test_idx]
    else:
        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=args.seed)
    model = RandomForestRegressor(n_estimators=300, random_state=args.seed, n_jobs=-1)
    model.fit(x_train, y_train)
    prediction = model.predict(x_test)
    metrics = {"RMSE": mean_squared_error(y_test, prediction) ** 0.5, "MAE": mean_absolute_error(y_test, prediction), "R2": r2_score(y_test, prediction), "seed": args.seed, "spatial_group": args.group or "random_split"}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.with_suffix(".metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    pd.DataFrame({"feature": args.features, "importance": model.feature_importances_}).sort_values("importance", ascending=False).to_csv(args.output.with_suffix(".feature_importance.csv"), index=False)
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
