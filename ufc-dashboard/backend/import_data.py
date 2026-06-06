import pandas as pd
from app import create_app
from database import db
from models import Fighter


def import_fighters(csv_path="data/fighters.csv"):
    app = create_app()
    with app.app_context():
        db.create_all()

        existing = db.session.query(Fighter).count()
        if existing > 0:
            print(f"Baza już zawiera {existing} zawodników — pomijam import.")
            return

        df = pd.read_csv(csv_path)

        def safe_float(val):
            try:
                return float(val)
            except (ValueError, TypeError):
                return None

        def safe_int(val):
            try:
                return int(val)
            except (ValueError, TypeError):
                return 0

        fighters = []
        for _, row in df.iterrows():
            f = Fighter(
                name=row["name"],
                nickname=row.get("nickname") or None,
                wins=safe_int(row.get("wins")),
                losses=safe_int(row.get("losses")),
                draws=safe_int(row.get("draws")),
                height_cm=safe_float(row.get("height_cm")),
                weight_kg=safe_float(row.get("weight_in_kg")),
                reach_cm=safe_float(row.get("reach_in_cm")),
                stance=row.get("stance") or None,
                date_of_birth=row.get("date_of_birth") or None,
                slpm=safe_float(row.get("significant_strikes_landed_per_minute")),
                str_acc=safe_float(row.get("significant_striking_accuracy")),
                sapm=safe_float(row.get("significant_strikes_absorbed_per_minute")),
                str_def=safe_float(row.get("significant_strike_defence")),
                td_avg=safe_float(row.get("average_takedowns_landed_per_15_minutes")),
                td_acc=safe_float(row.get("takedown_accuracy")),
                td_def=safe_float(row.get("takedown_defense")),
                sub_avg=safe_float(row.get("average_submissions_attempted_per_15_minutes")),
            )
            fighters.append(f)

        db.session.bulk_save_objects(fighters)
        db.session.commit()
        print(f"Zaimportowano {len(fighters)} zawodników.")


if __name__ == "__main__":
    import_fighters()
