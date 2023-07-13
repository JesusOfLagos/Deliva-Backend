import { readFile, writeFile } from 'fs';

const sourceFile = '.env';
const destinationFile = '.env.template';

// Read the source file
readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading ${sourceFile}: ${err}`);
        return;
    }

    // Extract variable names from the source file
    const variableNames = extractVariableNames(data);

    // Generate the content for the destination file
    const destinationContent = variableNames.join('\n');

    // Write the content to the destination file
    writeFile(destinationFile, destinationContent, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing ${destinationFile}: ${err}`);
            return;
        }

        console.log(`Variable names copied from ${sourceFile} to ${destinationFile}`);
    });
});

function extractVariableNames(data) {
    // Split the file content by lines
    const lines = data.split('\n');

    // Extract variable names
    const variableNames = lines
        .map((line) => line.trim()) // Trim leading/trailing spaces
        .filter((line) => line && !line.startsWith('#')) // Exclude empty lines and comments
        .map((line) => line.split('=')[0]); // Extract variable name before '='

    return variableNames;
}
