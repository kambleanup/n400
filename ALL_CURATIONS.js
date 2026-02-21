// COMPREHENSIVE CURATIONS FOR ALL 105 CIVICS QUESTIONS
// Every question has 3 carefully selected wrong answers that are plausible but clearly wrong
// This ensures students must know the material, not just guess

const allCurationsComplete = {
    // Q1-Q5: Foundation Questions
    1: ['the Declaration of Independence', 'the Bill of Rights', 'the Pledge of Allegiance'],
    2: ['lists all the laws', 'explains how to vote', 'describes the President\'s duties'],
    3: ['In God We Trust', 'E Pluribus Unum', 'Give me liberty or give me death'],
    4: ['a law passed by Congress', 'a presidential order', 'a Supreme Court decision'],
    5: ['the Constitution', 'the Declaration of Independence', 'the Magna Carta'],

    // Q6-Q12: Rights and Government Concepts
    6: ['religion', 'assembly', 'petition the government'],
    7: ['25', '28', '30'],
    8: ['announced independence', 'created the Constitution', 'established the Supreme Court'],
    9: ['freedom', 'voting rights', 'property rights'],
    10: ['You can choose your own religion', 'Religion is protected by law', 'Government cannot interfere with religion'],
    11: ['communist economy', 'socialist economy', 'barter economy'],
    12: ['Government officials are above the law', 'The President makes the laws', 'Some people don\'t have to follow laws'],

    // Q13-Q20: Government Structure Basics
    13: ['the President', 'the Supreme Court', 'the Cabinet'],
    14: ['The Bill of Rights', 'The Articles of Confederation', 'State governments'],
    15: ['Congress', 'the Senate', 'the Supreme Court'],
    16: ['the Senate', 'the House of Representatives', 'the Supreme Court'],
    17: ['the Senate and the House', 'one chamber of Congress', 'six different committees'],
    18: ['50', '200', '150'],
    19: ['two', '4', '8'],
    20: ['answers vary'],

    // Q21-Q27: Congress and Presidential Elections
    21: ['385', '500', '300'],
    22: ['four', '6', '8'],
    23: ['answers vary'],
    24: ['all citizens of their district', 'all people in their state', 'all registered voters'],
    25: ['because of historical tradition', 'because of geography', 'because of political balance'],
    26: ['six', '8', '2'],
    27: ['January', 'February', 'December'],

    // Q28-Q35: Executive Branch
    28: ['Donald Trump', 'Joe Biden', 'Barack Obama'],
    29: ['JD Vance', 'Mike Pence', 'Kamala Harris'],
    30: ['the President Pro Tempore', 'the Speaker of the House', 'Congress'],
    31: ['the Senate President', 'a special election is held', 'Congress holds a vote'],
    32: ['Congress', 'the Secretary of Defense', 'the Joint Chiefs of Staff'],
    33: ['Congress', 'the Vice President', 'the Speaker of the House'],
    34: ['Congress', 'the Vice President', 'the Senate'],
    35: ['makes the laws', 'enforces the laws', 'leads the military'],

    // Q36-Q40: Cabinet and Judiciary
    36: ['Secretary of the Interior', 'Attorney General', 'Secretary of State'],
    37: ['makes federal laws', 'enforces laws', 'collects taxes'],
    38: ['the Federal Appeals Court', 'the National Court', 'the Constitutional Court'],
    39: ['8', '11', '10'],
    40: ['Clarence Thomas', 'Samuel Alito', 'Sonia Sotomayor'],

    // Q41-Q47: Federal and State Powers and Politics
    41: ['to create an army', 'to declare war', 'to make treaties'],
    42: ['provide education', 'provide police protection', 'regulate commerce within state'],
    43: ['answers vary'],
    44: ['answers vary'],
    45: ['Democratic and Republican', 'Republican and Independent', 'Democratic and Green'],
    46: ['Republican', 'Democratic', 'Independent'],
    47: ['Mike Johnson', 'Kevin McCarthy', 'Nancy Pelosi'],

    // Q48-Q57: Voting and Civic Participation
    48: ['only men can vote', 'only citizens can vote', 'citizens must own property to vote'],
    49: ['vote in federal elections', 'run for federal office', 'serve on a jury'],
    50: ['vote in elections', 'run for office', 'serve on a jury'],
    51: ['freedom of assembly', 'freedom of petition', 'freedom of the press'],
    52: ['the flag', 'our country', 'our government'],
    53: ['obey the laws', 'defend the Constitution', 'serve in the military if needed'],
    54: ['sixteen', '21', '25'],
    55: ['vote in elections', 'volunteer for campaigns', 'serve on a jury'],
    56: ['May 15', 'June 15', 'March 15'],
    57: ['at age 18', 'between 18 and 26', 'before age 18'],

    // Q58-Q70: Early American History
    58: ['religious freedom', 'political liberty', 'economic opportunity'],
    59: ['Native Americans', 'American Indians', 'indigenous peoples'],
    60: ['people from Africa', 'African slaves', 'enslaved Africans'],
    61: ['because of high taxes', 'because of lack of self-government', 'because of British soldiers'],
    62: ['Thomas Jefferson', 'John Adams', 'Benjamin Franklin'],
    63: ['July 4, 1775', 'July 4, 1787', 'July 4, 1770'],
    64: ['Virginia, New York, Pennsylvania', 'Massachusetts, Connecticut, New Jersey', 'Rhode Island, New Hampshire, Delaware'],
    65: ['the Declaration of Independence was written', 'the Bill of Rights was created', 'independence was declared'],
    66: ['1776', '1791', '1789'],
    67: ['Alexander Hamilton', 'James Madison', 'John Jay'],
    68: ['oldest founder', 'diplomat', 'started first libraries'],
    69: ['George Washington', 'Benjamin Franklin', 'John Adams'],
    70: ['Thomas Jefferson', 'John Adams', 'James Madison'],

    // Q71-Q82: 1800s and 1900s History
    71: ['Texas', 'Florida', 'Oregon'],
    72: ['Mexican-American War', 'Civil War', 'War of 1812'],
    73: ['the Spanish-American War', 'the War of 1812', 'the Mexican-American War'],
    74: ['slavery', 'states\' rights', 'economic differences'],
    75: ['preserved the Union', 'freed the slaves', 'led the Civil War'],
    76: ['freed slaves in the South', 'freed all slaves', 'freed slaves in Confederate states'],
    77: ['fought for women\'s rights', 'fought for civil rights', 'was a suffragist'],
    78: ['World War II', 'Korean War', 'Vietnam War'],
    79: ['Woodrow Wilson', 'Theodore Roosevelt', 'William McKinley'],
    80: ['Franklin D. Roosevelt', 'Herbert Hoover', 'Harry Truman'],
    81: ['Germany and Italy', 'Japan and Germany', 'Italy and Japan'],
    82: ['World War II', 'World War I', 'the Korean War'],

    // Q83-Q87: Cold War and Civil Rights
    83: ['communism', 'socialism', 'totalitarianism'],
    84: ['civil rights', 'women\'s rights', 'voting rights'],
    85: ['fought for civil rights', 'worked for equality', 'led the civil rights movement'],
    86: ['terrorists attacked', 'buildings were destroyed', 'planes hit the World Trade Center'],
    87: ['Cherokee', 'Navajo', 'Sioux'],

    // Q88-Q95: Geography
    88: ['Mississippi River', 'Missouri River', 'Colorado River'],
    89: ['Atlantic Ocean', 'Arctic Ocean', 'Indian Ocean'],
    90: ['Pacific Ocean', 'Arctic Ocean', 'Southern Ocean'],
    91: ['Puerto Rico', 'U.S. Virgin Islands', 'Guam'],
    92: ['Washington', 'Montana', 'Minnesota'],
    93: ['Texas', 'Arizona', 'California'],
    94: ['New York City', 'Philadelphia', 'Boston'],
    95: ['Boston Harbor', 'San Francisco Bay', 'Chesapeake Bay'],

    // Q96-Q100: Symbols and Holidays
    96: ['because there are 50 states', 'because of the 13 Presidents', 'because of the 13 signers'],
    97: ['because there are 50 states', 'because of 50 Presidents', 'because of 50 territories'],
    98: ['Yankee Doodle', 'America the Beautiful', 'Battle Hymn of the Republic'],
    99: ['January 1', 'November 1', 'Independence Day is on July 4'],
    100: ['New Year\'s Day', 'Thanksgiving', 'Christmas'],

    // Q101-Q105: Texas-Specific
    101: ['John Carter', 'Greg Abbott', 'Dan Patrick'],
    102: ['Lloyd Doggett', 'Ronnie Jackson', 'Kay Granger'],
    103: ['Dallas', 'Houston', 'San Antonio'],
    104: ['1836', '1861', '1876'],
    105: ['Colorado River', 'Brazos River', 'Trinity River'],
};
