# pip install inaturalist-to-sqlite

from pyinaturalist import *
observations = get_observations(user_id='nir0306')

for obs in observations['results']:
    pprint(obs)
