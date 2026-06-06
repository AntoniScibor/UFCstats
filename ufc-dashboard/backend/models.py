from database import db


class Fighter(db.Model):
    __tablename__ = "fighters"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    nickname = db.Column(db.String(100))
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    draws = db.Column(db.Integer, default=0)
    height_cm = db.Column(db.Float)
    weight_kg = db.Column(db.Float)
    reach_cm = db.Column(db.Float)
    stance = db.Column(db.String(50))
    date_of_birth = db.Column(db.String(20))

    # Striking
    slpm = db.Column(db.Float)       # significant strikes landed per minute
    str_acc = db.Column(db.Float)    # striking accuracy %
    sapm = db.Column(db.Float)       # significant strikes absorbed per minute
    str_def = db.Column(db.Float)    # strike defence %

    # Grappling
    td_avg = db.Column(db.Float)     # takedowns per 15 min
    td_acc = db.Column(db.Float)     # takedown accuracy %
    td_def = db.Column(db.Float)     # takedown defence %
    sub_avg = db.Column(db.Float)    # submission attempts per 15 min

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "nickname": self.nickname,
            "record": {"wins": self.wins, "losses": self.losses, "draws": self.draws},
            "physical": {
                "height_cm": self.height_cm,
                "weight_kg": self.weight_kg,
                "reach_cm": self.reach_cm,
                "stance": self.stance,
                "date_of_birth": self.date_of_birth,
            },
            "striking": {
                "slpm": self.slpm,
                "str_acc": self.str_acc,
                "sapm": self.sapm,
                "str_def": self.str_def,
            },
            "grappling": {
                "td_avg": self.td_avg,
                "td_acc": self.td_acc,
                "td_def": self.td_def,
                "sub_avg": self.sub_avg,
            },
        }
