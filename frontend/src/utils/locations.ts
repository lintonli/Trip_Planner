// US Cities and States for ELD Trip Planning
export interface LocationOption {
  value: string;
  label: string;
  coordinates: [number, number]; // [latitude, longitude]
  state: string;
  category: 'major' | 'medium' | 'small';
}

export const US_LOCATIONS: LocationOption[] = [
  // Alabama
  { value: 'birmingham_al', label: 'Birmingham, AL', coordinates: [33.5207, -86.8025], state: 'Alabama', category: 'major' },
  { value: 'huntsville_al', label: 'Huntsville, AL', coordinates: [34.7304, -86.5861], state: 'Alabama', category: 'medium' },
  { value: 'mobile_al', label: 'Mobile, AL', coordinates: [30.6954, -88.0399], state: 'Alabama', category: 'medium' },
  { value: 'montgomery_al', label: 'Montgomery, AL', coordinates: [32.3668, -86.3000], state: 'Alabama', category: 'medium' },

  // Arizona
  { value: 'phoenix_az', label: 'Phoenix, AZ', coordinates: [33.4484, -112.0740], state: 'Arizona', category: 'major' },
  { value: 'tucson_az', label: 'Tucson, AZ', coordinates: [32.2217, -110.9265], state: 'Arizona', category: 'major' },
  { value: 'mesa_az', label: 'Mesa, AZ', coordinates: [33.4152, -111.8315], state: 'Arizona', category: 'medium' },
  { value: 'chandler_az', label: 'Chandler, AZ', coordinates: [33.3062, -111.8413], state: 'Arizona', category: 'medium' },
  { value: 'scottsdale_az', label: 'Scottsdale, AZ', coordinates: [33.4942, -111.9261], state: 'Arizona', category: 'medium' },
  { value: 'flagstaff_az', label: 'Flagstaff, AZ', coordinates: [35.1983, -111.6513], state: 'Arizona', category: 'small' },

  // Arkansas
  { value: 'little_rock_ar', label: 'Little Rock, AR', coordinates: [34.7465, -92.2896], state: 'Arkansas', category: 'major' },
  { value: 'fayetteville_ar', label: 'Fayetteville, AR', coordinates: [36.0625, -94.1574], state: 'Arkansas', category: 'medium' },
  { value: 'fort_smith_ar', label: 'Fort Smith, AR', coordinates: [35.3859, -94.3985], state: 'Arkansas', category: 'medium' },

  // California
  { value: 'los_angeles_ca', label: 'Los Angeles, CA', coordinates: [34.0522, -118.2437], state: 'California', category: 'major' },
  { value: 'san_francisco_ca', label: 'San Francisco, CA', coordinates: [37.7749, -122.4194], state: 'California', category: 'major' },
  { value: 'san_diego_ca', label: 'San Diego, CA', coordinates: [32.7157, -117.1611], state: 'California', category: 'major' },
  { value: 'sacramento_ca', label: 'Sacramento, CA', coordinates: [38.5816, -121.4944], state: 'California', category: 'major' },
  { value: 'san_jose_ca', label: 'San Jose, CA', coordinates: [37.3382, -121.8863], state: 'California', category: 'major' },
  { value: 'fresno_ca', label: 'Fresno, CA', coordinates: [36.7378, -119.7871], state: 'California', category: 'major' },
  { value: 'long_beach_ca', label: 'Long Beach, CA', coordinates: [33.7701, -118.1937], state: 'California', category: 'medium' },
  { value: 'oakland_ca', label: 'Oakland, CA', coordinates: [37.8044, -122.2712], state: 'California', category: 'medium' },
  { value: 'bakersfield_ca', label: 'Bakersfield, CA', coordinates: [35.3733, -119.0187], state: 'California', category: 'medium' },

  // Colorado
  { value: 'denver_co', label: 'Denver, CO', coordinates: [39.7392, -104.9903], state: 'Colorado', category: 'major' },
  { value: 'colorado_springs_co', label: 'Colorado Springs, CO', coordinates: [38.8339, -104.8214], state: 'Colorado', category: 'major' },
  { value: 'aurora_co', label: 'Aurora, CO', coordinates: [39.7294, -104.8319], state: 'Colorado', category: 'medium' },
  { value: 'fort_collins_co', label: 'Fort Collins, CO', coordinates: [40.5853, -105.0844], state: 'Colorado', category: 'medium' },

  // Connecticut
  { value: 'hartford_ct', label: 'Hartford, CT', coordinates: [41.7658, -72.6734], state: 'Connecticut', category: 'major' },
  { value: 'bridgeport_ct', label: 'Bridgeport, CT', coordinates: [41.1865, -73.1952], state: 'Connecticut', category: 'medium' },
  { value: 'new_haven_ct', label: 'New Haven, CT', coordinates: [41.3083, -72.9279], state: 'Connecticut', category: 'medium' },

  // Florida
  { value: 'miami_fl', label: 'Miami, FL', coordinates: [25.7617, -80.1918], state: 'Florida', category: 'major' },
  { value: 'tampa_fl', label: 'Tampa, FL', coordinates: [27.9506, -82.4572], state: 'Florida', category: 'major' },
  { value: 'orlando_fl', label: 'Orlando, FL', coordinates: [28.5383, -81.3792], state: 'Florida', category: 'major' },
  { value: 'jacksonville_fl', label: 'Jacksonville, FL', coordinates: [30.3322, -81.6557], state: 'Florida', category: 'major' },
  { value: 'fort_lauderdale_fl', label: 'Fort Lauderdale, FL', coordinates: [26.1224, -80.1373], state: 'Florida', category: 'medium' },
  { value: 'tallahassee_fl', label: 'Tallahassee, FL', coordinates: [30.4518, -84.2807], state: 'Florida', category: 'medium' },
  { value: 'pensacola_fl', label: 'Pensacola, FL', coordinates: [30.4213, -87.2169], state: 'Florida', category: 'medium' },

  // Georgia
  { value: 'atlanta_ga', label: 'Atlanta, GA', coordinates: [33.7490, -84.3880], state: 'Georgia', category: 'major' },
  { value: 'savannah_ga', label: 'Savannah, GA', coordinates: [32.0835, -81.0998], state: 'Georgia', category: 'major' },
  { value: 'augusta_ga', label: 'Augusta, GA', coordinates: [33.4735, -82.0105], state: 'Georgia', category: 'medium' },
  { value: 'columbus_ga', label: 'Columbus, GA', coordinates: [32.4610, -84.9877], state: 'Georgia', category: 'medium' },

  // Illinois
  { value: 'chicago_il', label: 'Chicago, IL', coordinates: [41.8781, -87.6298], state: 'Illinois', category: 'major' },
  { value: 'aurora_il', label: 'Aurora, IL', coordinates: [41.7606, -88.3201], state: 'Illinois', category: 'medium' },
  { value: 'peoria_il', label: 'Peoria, IL', coordinates: [40.6936, -89.5890], state: 'Illinois', category: 'medium' },
  { value: 'springfield_il', label: 'Springfield, IL', coordinates: [39.7817, -89.6501], state: 'Illinois', category: 'medium' },

  // Indiana
  { value: 'indianapolis_in', label: 'Indianapolis, IN', coordinates: [39.7684, -86.1581], state: 'Indiana', category: 'major' },
  { value: 'fort_wayne_in', label: 'Fort Wayne, IN', coordinates: [41.0793, -85.1394], state: 'Indiana', category: 'medium' },
  { value: 'evansville_in', label: 'Evansville, IN', coordinates: [37.9716, -87.5710], state: 'Indiana', category: 'medium' },

  // Iowa
  { value: 'des_moines_ia', label: 'Des Moines, IA', coordinates: [41.5868, -93.6250], state: 'Iowa', category: 'major' },
  { value: 'cedar_rapids_ia', label: 'Cedar Rapids, IA', coordinates: [41.9778, -91.6656], state: 'Iowa', category: 'medium' },
  { value: 'davenport_ia', label: 'Davenport, IA', coordinates: [41.5236, -90.5776], state: 'Iowa', category: 'medium' },

  // Kansas
  { value: 'wichita_ks', label: 'Wichita, KS', coordinates: [37.6872, -97.3301], state: 'Kansas', category: 'major' },
  { value: 'topeka_ks', label: 'Topeka, KS', coordinates: [39.0473, -95.6890], state: 'Kansas', category: 'medium' },
  { value: 'kansas_city_ks', label: 'Kansas City, KS', coordinates: [39.1142, -94.6275], state: 'Kansas', category: 'medium' },

  // Kentucky
  { value: 'louisville_ky', label: 'Louisville, KY', coordinates: [38.2527, -85.7585], state: 'Kentucky', category: 'major' },
  { value: 'lexington_ky', label: 'Lexington, KY', coordinates: [38.0406, -84.5037], state: 'Kentucky', category: 'medium' },
  { value: 'bowling_green_ky', label: 'Bowling Green, KY', coordinates: [36.9685, -86.4808], state: 'Kentucky', category: 'medium' },

  // Louisiana
  { value: 'new_orleans_la', label: 'New Orleans, LA', coordinates: [29.9511, -90.0715], state: 'Louisiana', category: 'major' },
  { value: 'baton_rouge_la', label: 'Baton Rouge, LA', coordinates: [30.4515, -91.1871], state: 'Louisiana', category: 'major' },
  { value: 'shreveport_la', label: 'Shreveport, LA', coordinates: [32.5252, -93.7502], state: 'Louisiana', category: 'medium' },

  // Maine
  { value: 'portland_me', label: 'Portland, ME', coordinates: [43.6591, -70.2568], state: 'Maine', category: 'major' },
  { value: 'bangor_me', label: 'Bangor, ME', coordinates: [44.8016, -68.7712], state: 'Maine', category: 'medium' },

  // Maryland
  { value: 'baltimore_md', label: 'Baltimore, MD', coordinates: [39.2904, -76.6122], state: 'Maryland', category: 'major' },
  { value: 'annapolis_md', label: 'Annapolis, MD', coordinates: [38.9784, -76.4951], state: 'Maryland', category: 'medium' },

  // Massachusetts
  { value: 'boston_ma', label: 'Boston, MA', coordinates: [42.3601, -71.0589], state: 'Massachusetts', category: 'major' },
  { value: 'worcester_ma', label: 'Worcester, MA', coordinates: [42.2626, -71.8023], state: 'Massachusetts', category: 'medium' },
  { value: 'springfield_ma', label: 'Springfield, MA', coordinates: [42.1015, -72.5898], state: 'Massachusetts', category: 'medium' },

  // Michigan
  { value: 'detroit_mi', label: 'Detroit, MI', coordinates: [42.3314, -83.0458], state: 'Michigan', category: 'major' },
  { value: 'grand_rapids_mi', label: 'Grand Rapids, MI', coordinates: [42.9634, -85.6681], state: 'Michigan', category: 'major' },
  { value: 'warren_mi', label: 'Warren, MI', coordinates: [42.5145, -83.0146], state: 'Michigan', category: 'medium' },
  { value: 'lansing_mi', label: 'Lansing, MI', coordinates: [42.3540, -84.5467], state: 'Michigan', category: 'medium' },

  // Minnesota
  { value: 'minneapolis_mn', label: 'Minneapolis, MN', coordinates: [44.9778, -93.2650], state: 'Minnesota', category: 'major' },
  { value: 'saint_paul_mn', label: 'Saint Paul, MN', coordinates: [44.9537, -93.0900], state: 'Minnesota', category: 'major' },
  { value: 'rochester_mn', label: 'Rochester, MN', coordinates: [44.0121, -92.4802], state: 'Minnesota', category: 'medium' },
  { value: 'duluth_mn', label: 'Duluth, MN', coordinates: [46.7867, -92.1005], state: 'Minnesota', category: 'medium' },

  // Mississippi
  { value: 'jackson_ms', label: 'Jackson, MS', coordinates: [32.2988, -90.1848], state: 'Mississippi', category: 'major' },
  { value: 'gulfport_ms', label: 'Gulfport, MS', coordinates: [30.3674, -89.0928], state: 'Mississippi', category: 'medium' },
  { value: 'hattiesburg_ms', label: 'Hattiesburg, MS', coordinates: [31.3271, -89.2903], state: 'Mississippi', category: 'medium' },

  // Missouri
  { value: 'kansas_city_mo', label: 'Kansas City, MO', coordinates: [39.0997, -94.5786], state: 'Missouri', category: 'major' },
  { value: 'saint_louis_mo', label: 'Saint Louis, MO', coordinates: [38.6270, -90.1994], state: 'Missouri', category: 'major' },
  { value: 'springfield_mo', label: 'Springfield, MO', coordinates: [37.2153, -93.2982], state: 'Missouri', category: 'medium' },
  { value: 'columbia_mo', label: 'Columbia, MO', coordinates: [38.9517, -92.3341], state: 'Missouri', category: 'medium' },

  // Montana
  { value: 'billings_mt', label: 'Billings, MT', coordinates: [45.7833, -108.5007], state: 'Montana', category: 'major' },
  { value: 'missoula_mt', label: 'Missoula, MT', coordinates: [46.8721, -113.9940], state: 'Montana', category: 'medium' },
  { value: 'great_falls_mt', label: 'Great Falls, MT', coordinates: [47.4941, -111.2833], state: 'Montana', category: 'medium' },

  // Nebraska
  { value: 'omaha_ne', label: 'Omaha, NE', coordinates: [41.2565, -95.9345], state: 'Nebraska', category: 'major' },
  { value: 'lincoln_ne', label: 'Lincoln, NE', coordinates: [40.8136, -96.7026], state: 'Nebraska', category: 'major' },

  // Nevada
  { value: 'las_vegas_nv', label: 'Las Vegas, NV', coordinates: [36.1699, -115.1398], state: 'Nevada', category: 'major' },
  { value: 'reno_nv', label: 'Reno, NV', coordinates: [39.5296, -119.8138], state: 'Nevada', category: 'major' },
  { value: 'henderson_nv', label: 'Henderson, NV', coordinates: [36.0395, -114.9817], state: 'Nevada', category: 'medium' },

  // New Hampshire
  { value: 'manchester_nh', label: 'Manchester, NH', coordinates: [42.9956, -71.4548], state: 'New Hampshire', category: 'major' },
  { value: 'nashua_nh', label: 'Nashua, NH', coordinates: [42.7654, -71.4676], state: 'New Hampshire', category: 'medium' },

  // New Jersey
  { value: 'newark_nj', label: 'Newark, NJ', coordinates: [40.7357, -74.1724], state: 'New Jersey', category: 'major' },
  { value: 'jersey_city_nj', label: 'Jersey City, NJ', coordinates: [40.7178, -74.0431], state: 'New Jersey', category: 'major' },
  { value: 'paterson_nj', label: 'Paterson, NJ', coordinates: [40.9168, -74.1718], state: 'New Jersey', category: 'medium' },
  { value: 'trenton_nj', label: 'Trenton, NJ', coordinates: [40.2206, -74.7565], state: 'New Jersey', category: 'medium' },

  // New Mexico
  { value: 'albuquerque_nm', label: 'Albuquerque, NM', coordinates: [35.0844, -106.6504], state: 'New Mexico', category: 'major' },
  { value: 'las_cruces_nm', label: 'Las Cruces, NM', coordinates: [32.3199, -106.7637], state: 'New Mexico', category: 'medium' },
  { value: 'santa_fe_nm', label: 'Santa Fe, NM', coordinates: [35.6870, -105.9378], state: 'New Mexico', category: 'medium' },

  // New York
  { value: 'new_york_ny', label: 'New York, NY', coordinates: [40.7128, -74.0060], state: 'New York', category: 'major' },
  { value: 'buffalo_ny', label: 'Buffalo, NY', coordinates: [42.8864, -78.8784], state: 'New York', category: 'major' },
  { value: 'rochester_ny', label: 'Rochester, NY', coordinates: [43.1566, -77.6088], state: 'New York', category: 'major' },
  { value: 'yonkers_ny', label: 'Yonkers, NY', coordinates: [40.9312, -73.8988], state: 'New York', category: 'medium' },
  { value: 'syracuse_ny', label: 'Syracuse, NY', coordinates: [43.0481, -76.1474], state: 'New York', category: 'medium' },
  { value: 'albany_ny', label: 'Albany, NY', coordinates: [42.6526, -73.7562], state: 'New York', category: 'medium' },

  // North Carolina
  { value: 'charlotte_nc', label: 'Charlotte, NC', coordinates: [35.2271, -80.8431], state: 'North Carolina', category: 'major' },
  { value: 'raleigh_nc', label: 'Raleigh, NC', coordinates: [35.7796, -78.6382], state: 'North Carolina', category: 'major' },
  { value: 'greensboro_nc', label: 'Greensboro, NC', coordinates: [36.0726, -79.7920], state: 'North Carolina', category: 'major' },
  { value: 'durham_nc', label: 'Durham, NC', coordinates: [35.9940, -78.8986], state: 'North Carolina', category: 'medium' },
  { value: 'winston_salem_nc', label: 'Winston-Salem, NC', coordinates: [36.0999, -80.2442], state: 'North Carolina', category: 'medium' },
  { value: 'asheville_nc', label: 'Asheville, NC', coordinates: [35.5951, -82.5515], state: 'North Carolina', category: 'medium' },

  // North Dakota
  { value: 'fargo_nd', label: 'Fargo, ND', coordinates: [46.8772, -96.7898], state: 'North Dakota', category: 'major' },
  { value: 'bismarck_nd', label: 'Bismarck, ND', coordinates: [46.8083, -100.7837], state: 'North Dakota', category: 'medium' },

  // Ohio
  { value: 'columbus_oh', label: 'Columbus, OH', coordinates: [39.9612, -82.9988], state: 'Ohio', category: 'major' },
  { value: 'cleveland_oh', label: 'Cleveland, OH', coordinates: [41.4993, -81.6944], state: 'Ohio', category: 'major' },
  { value: 'cincinnati_oh', label: 'Cincinnati, OH', coordinates: [39.1031, -84.5120], state: 'Ohio', category: 'major' },
  { value: 'toledo_oh', label: 'Toledo, OH', coordinates: [41.6528, -83.5379], state: 'Ohio', category: 'medium' },
  { value: 'akron_oh', label: 'Akron, OH', coordinates: [41.0814, -81.5190], state: 'Ohio', category: 'medium' },
  { value: 'dayton_oh', label: 'Dayton, OH', coordinates: [39.7589, -84.1916], state: 'Ohio', category: 'medium' },

  // Oklahoma
  { value: 'oklahoma_city_ok', label: 'Oklahoma City, OK', coordinates: [35.4676, -97.5164], state: 'Oklahoma', category: 'major' },
  { value: 'tulsa_ok', label: 'Tulsa, OK', coordinates: [36.1540, -95.9928], state: 'Oklahoma', category: 'major' },
  { value: 'norman_ok', label: 'Norman, OK', coordinates: [35.2226, -97.4395], state: 'Oklahoma', category: 'medium' },

  // Oregon
  { value: 'portland_or', label: 'Portland, OR', coordinates: [45.5152, -122.6784], state: 'Oregon', category: 'major' },
  { value: 'salem_or', label: 'Salem, OR', coordinates: [44.9429, -123.0351], state: 'Oregon', category: 'major' },
  { value: 'eugene_or', label: 'Eugene, OR', coordinates: [44.0521, -123.0868], state: 'Oregon', category: 'medium' },
  { value: 'gresham_or', label: 'Gresham, OR', coordinates: [45.5001, -122.4302], state: 'Oregon', category: 'medium' },

  // Pennsylvania
  { value: 'philadelphia_pa', label: 'Philadelphia, PA', coordinates: [39.9526, -75.1652], state: 'Pennsylvania', category: 'major' },
  { value: 'pittsburgh_pa', label: 'Pittsburgh, PA', coordinates: [40.4406, -79.9959], state: 'Pennsylvania', category: 'major' },
  { value: 'allentown_pa', label: 'Allentown, PA', coordinates: [40.6084, -75.4902], state: 'Pennsylvania', category: 'medium' },
  { value: 'erie_pa', label: 'Erie, PA', coordinates: [42.1292, -80.0851], state: 'Pennsylvania', category: 'medium' },
  { value: 'reading_pa', label: 'Reading, PA', coordinates: [40.3356, -75.9269], state: 'Pennsylvania', category: 'medium' },
  { value: 'scranton_pa', label: 'Scranton, PA', coordinates: [41.4090, -75.6624], state: 'Pennsylvania', category: 'medium' },

  // Rhode Island
  { value: 'providence_ri', label: 'Providence, RI', coordinates: [41.8240, -71.4128], state: 'Rhode Island', category: 'major' },
  { value: 'warwick_ri', label: 'Warwick, RI', coordinates: [41.7001, -71.4162], state: 'Rhode Island', category: 'medium' },

  // South Carolina
  { value: 'charleston_sc', label: 'Charleston, SC', coordinates: [32.7765, -79.9311], state: 'South Carolina', category: 'major' },
  { value: 'columbia_sc', label: 'Columbia, SC', coordinates: [34.0007, -81.0348], state: 'South Carolina', category: 'major' },
  { value: 'greenville_sc', label: 'Greenville, SC', coordinates: [34.8526, -82.3940], state: 'South Carolina', category: 'medium' },

  // South Dakota
  { value: 'sioux_falls_sd', label: 'Sioux Falls, SD', coordinates: [43.5446, -96.7311], state: 'South Dakota', category: 'major' },
  { value: 'rapid_city_sd', label: 'Rapid City, SD', coordinates: [44.0805, -103.2310], state: 'South Dakota', category: 'medium' },

  // Tennessee
  { value: 'nashville_tn', label: 'Nashville, TN', coordinates: [36.1627, -86.7816], state: 'Tennessee', category: 'major' },
  { value: 'memphis_tn', label: 'Memphis, TN', coordinates: [35.1495, -90.0490], state: 'Tennessee', category: 'major' },
  { value: 'knoxville_tn', label: 'Knoxville, TN', coordinates: [35.9606, -83.9207], state: 'Tennessee', category: 'major' },
  { value: 'chattanooga_tn', label: 'Chattanooga, TN', coordinates: [35.0456, -85.3097], state: 'Tennessee', category: 'medium' },

  // Texas
  { value: 'houston_tx', label: 'Houston, TX', coordinates: [29.7604, -95.3698], state: 'Texas', category: 'major' },
  { value: 'san_antonio_tx', label: 'San Antonio, TX', coordinates: [29.4241, -98.4936], state: 'Texas', category: 'major' },
  { value: 'dallas_tx', label: 'Dallas, TX', coordinates: [32.7767, -96.7970], state: 'Texas', category: 'major' },
  { value: 'austin_tx', label: 'Austin, TX', coordinates: [30.2672, -97.7431], state: 'Texas', category: 'major' },
  { value: 'fort_worth_tx', label: 'Fort Worth, TX', coordinates: [32.7555, -97.3308], state: 'Texas', category: 'major' },
  { value: 'el_paso_tx', label: 'El Paso, TX', coordinates: [31.7619, -106.4850], state: 'Texas', category: 'major' },
  { value: 'arlington_tx', label: 'Arlington, TX', coordinates: [32.7357, -97.1081], state: 'Texas', category: 'medium' },
  { value: 'corpus_christi_tx', label: 'Corpus Christi, TX', coordinates: [27.8006, -97.3964], state: 'Texas', category: 'medium' },
  { value: 'plano_tx', label: 'Plano, TX', coordinates: [33.0198, -96.6989], state: 'Texas', category: 'medium' },
  { value: 'lubbock_tx', label: 'Lubbock, TX', coordinates: [33.5779, -101.8552], state: 'Texas', category: 'medium' },
  { value: 'laredo_tx', label: 'Laredo, TX', coordinates: [27.5306, -99.4803], state: 'Texas', category: 'medium' },
  { value: 'amarillo_tx', label: 'Amarillo, TX', coordinates: [35.2220, -101.8313], state: 'Texas', category: 'medium' },

  // Utah
  { value: 'salt_lake_city_ut', label: 'Salt Lake City, UT', coordinates: [40.7608, -111.8910], state: 'Utah', category: 'major' },
  { value: 'west_valley_city_ut', label: 'West Valley City, UT', coordinates: [40.6916, -112.0010], state: 'Utah', category: 'medium' },
  { value: 'provo_ut', label: 'Provo, UT', coordinates: [40.2338, -111.6585], state: 'Utah', category: 'medium' },
  { value: 'ogden_ut', label: 'Ogden, UT', coordinates: [41.2230, -111.9738], state: 'Utah', category: 'medium' },

  // Vermont
  { value: 'burlington_vt', label: 'Burlington, VT', coordinates: [44.4759, -73.2121], state: 'Vermont', category: 'major' },
  { value: 'montpelier_vt', label: 'Montpelier, VT', coordinates: [44.2601, -72.5806], state: 'Vermont', category: 'small' },

  // Virginia
  { value: 'virginia_beach_va', label: 'Virginia Beach, VA', coordinates: [36.8529, -75.9780], state: 'Virginia', category: 'major' },
  { value: 'norfolk_va', label: 'Norfolk, VA', coordinates: [36.8468, -76.2852], state: 'Virginia', category: 'major' },
  { value: 'chesapeake_va', label: 'Chesapeake, VA', coordinates: [36.7682, -76.2875], state: 'Virginia', category: 'major' },
  { value: 'richmond_va', label: 'Richmond, VA', coordinates: [37.5407, -77.4360], state: 'Virginia', category: 'major' },
  { value: 'newport_news_va', label: 'Newport News, VA', coordinates: [37.0871, -76.4730], state: 'Virginia', category: 'medium' },
  { value: 'alexandria_va', label: 'Alexandria, VA', coordinates: [38.8048, -77.0469], state: 'Virginia', category: 'medium' },

  // Washington
  { value: 'seattle_wa', label: 'Seattle, WA', coordinates: [47.6062, -122.3321], state: 'Washington', category: 'major' },
  { value: 'spokane_wa', label: 'Spokane, WA', coordinates: [47.6587, -117.4260], state: 'Washington', category: 'major' },
  { value: 'tacoma_wa', label: 'Tacoma, WA', coordinates: [47.2529, -122.4443], state: 'Washington', category: 'major' },
  { value: 'vancouver_wa', label: 'Vancouver, WA', coordinates: [45.6387, -122.6615], state: 'Washington', category: 'medium' },
  { value: 'bellevue_wa', label: 'Bellevue, WA', coordinates: [47.6101, -122.2015], state: 'Washington', category: 'medium' },
  { value: 'everett_wa', label: 'Everett, WA', coordinates: [47.9790, -122.2021], state: 'Washington', category: 'medium' },

  // West Virginia
  { value: 'charleston_wv', label: 'Charleston, WV', coordinates: [38.3498, -81.6326], state: 'West Virginia', category: 'major' },
  { value: 'huntington_wv', label: 'Huntington, WV', coordinates: [38.4192, -82.4452], state: 'West Virginia', category: 'medium' },

  // Wisconsin
  { value: 'milwaukee_wi', label: 'Milwaukee, WI', coordinates: [43.0389, -87.9065], state: 'Wisconsin', category: 'major' },
  { value: 'madison_wi', label: 'Madison, WI', coordinates: [43.0731, -89.4012], state: 'Wisconsin', category: 'major' },
  { value: 'green_bay_wi', label: 'Green Bay, WI', coordinates: [44.5133, -88.0133], state: 'Wisconsin', category: 'medium' },
  { value: 'kenosha_wi', label: 'Kenosha, WI', coordinates: [42.5847, -87.8212], state: 'Wisconsin', category: 'medium' },

  // Wyoming
  { value: 'cheyenne_wy', label: 'Cheyenne, WY', coordinates: [41.1400, -104.8197], state: 'Wyoming', category: 'major' },
  { value: 'casper_wy', label: 'Casper, WY', coordinates: [42.8666, -106.3131], state: 'Wyoming', category: 'medium' },

  // Washington D.C.
  { value: 'washington_dc', label: 'Washington, DC', coordinates: [38.9072, -77.0369], state: 'District of Columbia', category: 'major' },
];

// Sort locations alphabetically by label
export const SORTED_LOCATIONS = US_LOCATIONS.sort((a, b) => a.label.localeCompare(b.label));

// Group locations by state
export const LOCATIONS_BY_STATE = US_LOCATIONS.reduce((acc, location) => {
  if (!acc[location.state]) {
    acc[location.state] = [];
  }
  acc[location.state].push(location);
  return acc;
}, {} as Record<string, LocationOption[]>);

// Get coordinates for a location value
export const getLocationCoordinates = (value: string): [number, number] | null => {
  const location = US_LOCATIONS.find(loc => loc.value === value);
  return location ? location.coordinates : null;
};

// Get location label for a value
export const getLocationLabel = (value: string): string => {
  const location = US_LOCATIONS.find(loc => loc.value === value);
  return location ? location.label : value;
};
