from flask import Flask, render_template
from flask.ext.pymongo import PyMongo
from flask.ext.restful import Resource, Api

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'test_database'
mongo = PyMongo(app)
api = Api(app)

@app.route('/')
def movie_map():
    return render_template('app.html')

#API to access list of locations associated with movie name
class MovieTitleLocation(Resource):
    def get(self, movie_title):
        locations = []
        for movie in mongo.db.movies.find({'title': movie_title}):
            if 'locations' in movie:
                locations.append(movie['locations'])

        return locations

#API to access list of movie titles
class MovieTitles(Resource):
    def get(self):
        movies = mongo.db.movies.find({'locations':{'$exists':True}}).distinct('title')
        return movies

api.add_resource(MovieTitleLocation, '/<string:movie_title>')
api.add_resource(MovieTitles, '/titles')

if __name__ =='__main__':
    app.run(debug=True)