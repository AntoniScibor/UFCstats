from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db, init_db
from models import Fighter


def create_app():
    app = Flask(__name__)
    CORS(app)
    init_db(app)
    return app


app = create_app()


@app.route("/api/fighters")
def get_fighters():
    query = Fighter.query

    search = request.args.get("search", "").strip()
    if search:
        query = query.filter(Fighter.name.ilike(f"%{search}%"))

    stance = request.args.get("stance")
    if stance:
        query = query.filter(Fighter.stance == stance)

    sort = request.args.get("sort", "name")
    order = request.args.get("order", "asc")
    sort_col = getattr(Fighter, sort, Fighter.name)
    query = query.order_by(sort_col.desc() if order == "desc" else sort_col.asc())

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    per_page = min(per_page, 100)

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "fighters": [f.to_dict() for f in paginated.items],
        "total": paginated.total,
        "page": page,
        "pages": paginated.pages,
    })


@app.route("/api/fighters/<int:fighter_id>")
def get_fighter(fighter_id):
    fighter = Fighter.query.get_or_404(fighter_id)
    return jsonify(fighter.to_dict())


@app.route("/api/compare")
def compare_fighters():
    f1_id = request.args.get("f1", type=int)
    f2_id = request.args.get("f2", type=int)
    if not f1_id or not f2_id:
        return jsonify({"error": "Podaj f1 i f2"}), 400

    f1 = Fighter.query.get_or_404(f1_id)
    f2 = Fighter.query.get_or_404(f2_id)
    return jsonify({"fighter1": f1.to_dict(), "fighter2": f2.to_dict()})


@app.route("/api/stances")
def get_stances():
    stances = (
        db.session.query(Fighter.stance)
        .filter(Fighter.stance.isnot(None))
        .distinct()
        .order_by(Fighter.stance)
        .all()
    )
    return jsonify([s[0] for s in stances])


@app.route("/api/health")
def health():
    count = Fighter.query.count()
    return jsonify({"status": "ok", "fighters_in_db": count})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
