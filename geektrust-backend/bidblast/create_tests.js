const fs = require('fs');
const path = require('path');

/**
 * Function to create folder structure and test files (input.txt and expected.txt)
 * @param {string} folderPath - The base folder where the test files will be created
 * @param {string} inputText - The content to be written into the input.txt file
 * @param {string} expectedText - The content to be written into the expected.txt file
 */
function createTestFiles(folderPath, inputText, expectedText) {
  try {
    // Check if folder exists, if not, create it
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Define file paths for input and expected output
    const inputFilePath = path.join(folderPath, 'input.txt');
    const expectedFilePath = path.join(folderPath, 'expected.txt');

    // Write the input text to the input.txt file
    fs.writeFileSync(inputFilePath, inputText, 'utf8');
    console.log(`Input file created at: ${inputFilePath}`);

    // Write the expected output text to the expected.txt file
    fs.writeFileSync(expectedFilePath, expectedText, 'utf8');
    console.log(`Expected file created at: ${expectedFilePath}`);
  } catch (err) {
    console.error(`Error creating test files in folder ${folderPath}: ${err.message}`);
  }
}

/**
 * Main function to generate test cases in a given folder
 * @param {string} folderPath - The folder where test files will be created
 */
function generateTestCases(folderPath) {
  // Test Case 1: Basic Member and Event Addition
  const input1 = `
ADD_MEMBER,John,10000
ADD_EVENT,Event1,IPHONE-14,2023-09-11
`;
  const expected1 = `
MEMBER_ADDED 1 John 10000
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
`;

  // Test Case 2: Registering Member for an Event
  const input2 = `
ADD_MEMBER,John,10000
ADD_EVENT,Event1,IPHONE-14,2023-09-11
REGISTER_MEMBER,1,1
`;
  const expected2 = `
MEMBER_ADDED 1 John 10000
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
MEMBER_REGISTERED 1 John
`;

  // Test Case 3: Submitting Bids for an Event
  const input3 = `
ADD_MEMBER,John,10000
ADD_MEMBER,Alice,10000
ADD_EVENT,Event1,IPHONE-14,2023-09-11
REGISTER_MEMBER,1,1
REGISTER_MEMBER,2,1
SUBMIT_BID,1,1,100,200,300,400
SUBMIT_BID,2,1,150,250,350,450
`;
  const expected3 = `
MEMBER_ADDED 1 John 10000
MEMBER_ADDED 2 Alice 10000
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
MEMBER_REGISTERED 1 John
MEMBER_REGISTERED 2 Alice
BIDS_SUBMITTED
BIDS_SUBMITTED
`;

  // Test Case 4: Insufficient Coins for a Bid
  const input4 = `
ADD_MEMBER,John,100
ADD_EVENT,Event1,IPHONE-14,2023-09-11
REGISTER_MEMBER,1,1
SUBMIT_BID,1,1,200
`;
  const expected4 = `
MEMBER_ADDED 1 John 100
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
MEMBER_REGISTERED 1 John
ERROR Insufficient Coins
`;

  // Test Case 5: Registering a Member for an Event They Are Already Registered for
  const input5 = `
ADD_MEMBER,John,10000
ADD_EVENT,Event1,IPHONE-14,2023-09-11
REGISTER_MEMBER,1,1
REGISTER_MEMBER,1,1
`;
  const expected5 = `
MEMBER_ADDED 1 John 10000
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
MEMBER_REGISTERED 1 John
ERROR Already registered for this event
`;

  // Test Case 6: Submitting More Than 5 Bids
  const input6 = `
ADD_MEMBER,John,10000
ADD_EVENT,Event1,IPHONE-14,2023-09-11
REGISTER_MEMBER,1,1
SUBMIT_BID,1,1,100,200,300,400,500,600
`;
  const expected6 = `
MEMBER_ADDED 1 John 10000
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
MEMBER_REGISTERED 1 John
ERROR Can submit at most 5 bids
`;

  // Test Case 7: Declaring Winner for an Event
  const input7 = `
ADD_MEMBER,John,10000
ADD_MEMBER,Alice,10000
ADD_EVENT,Event1,IPHONE-14,2023-09-11
REGISTER_MEMBER,1,1
REGISTER_MEMBER,2,1
SUBMIT_BID,1,1,100,200,300,400
SUBMIT_BID,2,1,150,250,350,450
DECLARE_WINNER,1
`;
  const expected7 = `
MEMBER_ADDED 1 John 10000
MEMBER_ADDED 2 Alice 10000
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
MEMBER_REGISTERED 1 John
MEMBER_REGISTERED 2 Alice
BIDS_SUBMITTED
BIDS_SUBMITTED
WINNER_DECLARED 1 John
`;

  // Test Case 8: No Bids Submitted for an Event
  const input8 = `
ADD_MEMBER,John,10000
ADD_EVENT,Event1,IPHONE-14,2023-09-11
REGISTER_MEMBER,1,1
DECLARE_WINNER,1
`;
  const expected8 = `
MEMBER_ADDED 1 John 10000
EVENT_ADDED 1 Event1 IPHONE-14 2023-09-11
MEMBER_REGISTERED 1 John
ERROR No bids were submitted
`;

  // Test Case 9: Declaring Winner When No Event Exists
  const input9 = `
DECLARE_WINNER,1
`;
  const expected9 = `
ERROR Event with the given id:1 does not exist
`;

  // Create the test files for each test case in different folders
  createTestFiles(path.join(folderPath, 'test_input_2'), input1, expected1);
  createTestFiles(path.join(folderPath, 'test_input_3'), input2, expected2);
  createTestFiles(path.join(folderPath, 'test_input_4'), input3, expected3);
  createTestFiles(path.join(folderPath, 'test_input_5'), input4, expected4);
  createTestFiles(path.join(folderPath, 'test_input_6'), input5, expected5);
  createTestFiles(path.join(folderPath, 'test_input_7'), input6, expected6);
  createTestFiles(path.join(folderPath, 'test_input_8'), input7, expected7);
  createTestFiles(path.join(folderPath, 'test_input_9'), input8, expected8);
  createTestFiles(path.join(folderPath, 'test_input_10'), input9, expected9);
}

// Get the folder path from command line arguments (default is current directory)
const folderPath = process.argv[2] || './test_cases';

// Generate the test cases
generateTestCases(folderPath);
