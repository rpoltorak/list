import os
import unittest

from germany import germany

_SOURCE_ID = "abc123"
_SOURCE_URL = "foo.bar"
_PARSED_CASE = [
    {
        "caseReference": {
            "sourceId": "abc123",
            "sourceUrl": "foo.bar"
        },
        "location": {
            "query": "SK Flensburg, Schleswig-Holstein, Germany",
            "limitToResolution": "Country,Admin1,Admin2",
        },
        "events": [
            {
                "name": "confirmed",
                "dateRange": {
                    "start": "08/15/2020Z",
                    "end": "08/15/2020Z"
                }
            }
        ],
        "demographics": {
            "gender": "Female",
            "ageRange": {
                "start": 5.0,
                "end": 14.0
            }
        }
    },
    {
        "caseReference": {
            "sourceId": "abc123",
            "sourceUrl": "foo.bar"
        },
        "location": {
            "query": "SK Kiel, Schleswig-Holstein, Germany",
            "limitToResolution": "Country,Admin1,Admin2",
        },
        "events": [
            {
                "name": "confirmed",
                "dateRange": {
                    "start": "03/23/2020Z",
                    "end": "03/23/2020Z"
                }
            },
            {
                "name": "onsetSymptoms",
                "dateRange": {
                    "start": "03/20/2020Z",
                    "end": "03/20/2020Z"
                }
            }            
        ],
        "demographics": {
            "gender": "Male",
            "ageRange": {
                "start": 15.0,
                "end": 34.0
            }
        }
    }
]


class GermanyTest(unittest.TestCase):
    def test_parse(self):
        # Default of 1500 is not enough to show diffs when there is one.
        self.maxDiff = 5000
        current_dir = os.path.dirname(__file__)
        sample_data_file = os.path.join(current_dir, "sample_data.csv")

        result = germany.parse_cases(sample_data_file, _SOURCE_ID, _SOURCE_URL)
        self.assertCountEqual(list(result), _PARSED_CASE)
