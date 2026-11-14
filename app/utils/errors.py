from flask import render_template

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return render_template('errors/400.html'), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return render_template('errors/401.html'), 401

    @app.errorhandler(403)
    def forbidden(error):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def not_found(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(429)
    def too_many_requests(error):
        return render_template('errors/429.html'), 429

    @app.errorhandler(500)
    def internal_error(error):
        return render_template('errors/500.html'), 500
