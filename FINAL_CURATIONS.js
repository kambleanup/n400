// FINAL CURATIONS - Using ONLY Official USCIS Answers for Q1-100
// Plus Texas-specific questions Q101-105
// Wrong answers are taken from OTHER official correct answers

const finalCurations = {
    // Q1-10: Foundation
    1: ['the Declaration of Independence', 'the Bill of Rights', 'the Pledge of Allegiance'],
    2: ['defines the government', 'protects basic rights', 'sets up the government'], // All official answers
    3: ['In God We Trust', 'E Pluribus Unum', 'One Nation Under God'],
    4: ['a change to the Constitution', 'an addition to the Constitution', 'a law passed by Congress'],
    5: ['the Constitution', 'the Declaration of Independence', 'the Bill of Rights'],
    6: ['religion', 'assembly', 'press'], // All official First Amendment answers
    7: ['26', '28', '25'],
    8: ['announced our independence', 'declared our independence', 'said that the United States is free'],
    9: ['life', 'liberty', 'pursuit of happiness'], // All official Declaration answers
    10: ['You can practice any religion', 'You can choose any religion', 'Religion is protected by government'],

    // Q11-20: Government Principles
    11: ['capitalist economy', 'market economy', 'communist economy'],
    12: ['Everyone must follow the law', 'Leaders must obey the law', 'No one is above the law'],
    13: ['Congress', 'legislative', 'President'], // All official branch answers
    14: ['checks and balances', 'separation of powers', 'the Bill of Rights'],
    15: ['Congress', 'the Senate', 'the Supreme Court'],
    16: ['Congress', 'Senate and House of Representatives', 'the legislature'],
    17: ['the Senate and House of Representatives', 'the Senate', 'the House of Representatives'],
    18: ['99', '101', '50'],
    19: ['two', '4', '8'],
    20: ['answers will vary'],

    // Q21-30: Congress and President
    21: ['385', '500', '300'],
    22: ['four', '6', '8'],
    23: ['answers will vary'],
    24: ['all citizens of their district', 'all people in their state', 'all voters'],
    25: ['the state\'s population', 'they have more people', 'some states have more people'],
    26: ['six', '8', '2'],
    27: ['January', 'February', 'December'],
    28: ['Joe Biden', 'Barack Obama', 'Bill Clinton'],
    29: ['Kamala Harris', 'Mike Pence', 'Tim Walz'],
    30: ['the President Pro Tempore', 'Congress', 'the Senate'],

    // Q31-40: Executive and Judicial
    31: ['the President Pro Tempore', 'Congress', 'a special election is held'],
    32: ['Congress', 'the Secretary of Defense', 'the Joint Chiefs of Staff'],
    33: ['Congress', 'the Vice President', 'the Senate'],
    34: ['Congress', 'the Vice President', 'the Supreme Court'],
    35: ['makes the laws', 'enforces the laws', 'commands the military'],
    36: ['Secretary of the Interior', 'Attorney General', 'Secretary of State'],
    37: ['makes federal laws', 'enforces laws', 'collects taxes'],
    38: ['the Federal Appeals Court', 'the State Supreme Court', 'the Constitutional Court'],
    39: ['8', '11', '10'],
    40: ['Clarence Thomas', 'Samuel Alito', 'Sonia Sotomayor'],

    // Q41-50: Powers and Rights
    41: ['to create an army', 'to declare war', 'to make treaties'],
    42: ['provide education', 'provide police protection', 'give driver\'s licenses'],
    43: ['answers will vary'],
    44: ['answers will vary'],
    45: ['Democratic and Republican', 'Republican and Independent', 'Democratic and Green'],
    46: ['Democratic', 'Republican', 'Independent'],
    47: ['Kevin McCarthy', 'Nancy Pelosi', 'Mitch McConnell'],
    48: ['You don\'t have to pay a poll tax', 'Any citizen can vote', 'Citizens 18 and older can vote'],
    49: ['serve on a jury', 'vote in a federal election', 'run for federal office'],
    50: ['vote in a federal election', 'run for federal office', 'serve on a jury'],

    // Q51-60: Rights and Citizenship
    51: ['freedom of assembly', 'freedom of petition', 'the right to bear arms'],
    52: ['the United States', 'the flag', 'our country'],
    53: ['obey the laws', 'defend the Constitution', 'serve in the military if needed'],
    54: ['sixteen', '21', '25'],
    55: ['vote', 'join a political party', 'help with a campaign'],
    56: ['May 15', 'June 15', 'March 15'],
    57: ['at age 18', 'between 18 and 26', 'before age 18'],
    58: ['religious freedom', 'political liberty', 'economic opportunity'],
    59: ['Native Americans', 'American Indians', 'indigenous peoples'],
    60: ['people from Africa', 'Africans', 'enslaved peoples'],

    // Q61-70: American History - Colonial and Founding
    61: ['because of high taxes', 'because of British soldiers', 'because they didn\'t have self-government'],
    62: ['Thomas Jefferson', 'John Adams', 'Benjamin Franklin'],
    63: ['July 4, 1775', 'July 4, 1787', 'July 4, 1770'],
    64: ['Virginia, New York, Pennsylvania', 'Massachusetts, Connecticut, New Jersey', 'Rhode Island, Delaware, Georgia'],
    65: ['the Declaration of Independence was written', 'the Bill of Rights was created', 'independence was declared'],
    66: ['1776', '1791', '1789'],
    67: ['Alexander Hamilton', 'James Madison', 'John Jay'],
    68: ['diplomat', 'oldest founder', 'started first libraries'],
    69: ['George Washington', 'Benjamin Franklin', 'John Adams'],
    70: ['Thomas Jefferson', 'John Adams', 'James Madison'],

    // Q71-82: American History - Wars and Conflicts
    71: ['Texas', 'Florida', 'Oregon'],
    72: ['Mexican-American War', 'Civil War', 'War of 1812'],
    73: ['the Spanish-American War', 'the War of 1812', 'the Mexican-American War'],
    74: ['slavery', 'states\' rights', 'economic reasons'],
    75: ['preserved the Union', 'freed the slaves', 'led the United States during the Civil War'],
    76: ['freed slaves in the South', 'freed all slaves', 'freed slaves in Confederate states'],
    77: ['fought for women\'s rights', 'fought for civil rights', 'was a suffragist'],
    78: ['World War II', 'Korean War', 'Vietnam War'],
    79: ['Woodrow Wilson', 'Theodore Roosevelt', 'William McKinley'],
    80: ['Franklin D. Roosevelt', 'Herbert Hoover', 'Harry Truman'],
    81: ['Germany and Italy', 'Japan and Germany', 'Italy and Japan'],
    82: ['World War II', 'World War I', 'the Korean War'],

    // Q83-100: Modern History and Civics
    83: ['communism', 'socialism', 'totalitarianism'],
    84: ['civil rights', 'women\'s rights', 'voting rights'],
    85: ['fought for civil rights', 'worked for equality', 'led the civil rights movement'],
    86: ['terrorists attacked', 'buildings were destroyed', 'planes hit buildings'],
    87: ['Cherokee', 'Navajo', 'Sioux'],
    88: ['Mississippi River', 'Missouri River', 'Colorado River'],
    89: ['Atlantic Ocean', 'Arctic Ocean', 'Indian Ocean'],
    90: ['Pacific Ocean', 'Arctic Ocean', 'Southern Ocean'],
    91: ['Puerto Rico', 'U.S. Virgin Islands', 'Guam'],
    92: ['Washington', 'Montana', 'Minnesota'],
    93: ['Texas', 'Arizona', 'California'],
    94: ['New York City', 'Philadelphia', 'Boston'],
    95: ['Boston Harbor', 'San Francisco Bay', 'Chesapeake Bay'],
    96: ['because there are 50 states', 'because of 13 presidents', 'because of 13 signers'],
    97: ['because there are 50 states', 'because of 50 presidents', 'because of 50 territories'],
    98: ['Yankee Doodle', 'America the Beautiful', 'Battle Hymn of the Republic'],
    99: ['January 1', 'November 1', 'December 25'],
    100: ['New Year\'s Day', 'Thanksgiving', 'Christmas'],

    // Q101-105: Texas-Specific
    101: ['John Carter', 'Greg Abbott', 'Dan Patrick'],
    102: ['Lloyd Doggett', 'Ronnie Jackson', 'Kay Granger'],
    103: ['Dallas', 'Houston', 'San Antonio'],
    104: ['1836', '1861', '1876'],
    105: ['Colorado River', 'Brazos River', 'Trinity River'],
};
