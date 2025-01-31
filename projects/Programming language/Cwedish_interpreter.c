#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_LENGTH 256
#define TEMP_C_FILE "temp_code.c"
#define TEMP_EXECUTABLE "temp_executable"

// Function to replace keywords
void replace_keywords(char *line) {
    // List of svenska keywords and their C equivalents
    const char *keywords[][2] = {
        {"heltal", "int"},
        {"osignerad", "unsigned"},
        {"register", "register"},
        {"medan", "while"},
        {"union", "union"},
        {"fall", "case"},
        {"göra", "do"},
        {"uppräkning", "enum"},
        {"lång", "long"},
        {"ogiltig", "void"},
        {"strukturera", "struct"},
        {"för", "for"},
        {"statisk", "static"},
        {"konst", "const"},
        {"dubbel", "double"},
        {"kort", "short"},
        {"karaktär", "char"},
        {"klass", "class"},
        {"växla", "switch"},
        {"auto", "auto"},
        {"fortsätta", "continue"},
        {"annan", "else"},
        {"flyta", "float"},
        {"signerad", "signed"},
        {"bryta", "break"},
        {"flyktig", "volatile"},
        {"typdef", "typedef"},
        {"återvända", "return"},
        {"standard", "default"},
        {"om", "if"},
        {"gå till", "goto"},
        {"skrivut", "printf"},
        {"avsöka", "scanf"},  
        // Correct mapping of 'huvud' to 'main'
        {"huvud", "main"},
        {"Kontakt", "struct Kontakt"},

        {NULL, NULL}
    };

    // Check each keyword and replace it in the line
    for (int i = 0; keywords[i][0] != NULL; i++) {
        char *pos;
        while ((pos = strstr(line, keywords[i][0])) != NULL) {
            // Replace keyword
            char buffer[MAX_LENGTH];
            strncpy(buffer, line, pos - line);
            buffer[pos - line] = '\0';
            strcat(buffer, keywords[i][1]);
            strcat(buffer, pos + strlen(keywords[i][0]));
            strcpy(line, buffer);
        }
    }
}

// Function to read from a file, replace keywords, and generate a C file
void read_and_execute_file(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("Could not open file");
        return;
    }

    FILE *temp_file = fopen(TEMP_C_FILE, "w");
    if (!temp_file) {
        perror("Could not create temporary C file");
        fclose(file);
        return;
    }

    char line[MAX_LENGTH];
    int has_main_function = 0;

    // Write the standard C includes to the temporary file
    fprintf(temp_file, "#include <stdio.h>\n\n");

    // Read each line, replace keywords, and write to the temporary file
    while (fgets(line, sizeof(line), file)) {
        replace_keywords(line);

        // Check if the line contains "main" to avoid multiple definitions
        if (strstr(line, "main")) {
            has_main_function = 1;
        }

        fprintf(temp_file, "%s", line);
    }

    // If no main function exists, define one
    if (!has_main_function) {
        fprintf(temp_file, "int main() {\n");
        fprintf(temp_file, "    // Add your logic here\n");
        fprintf(temp_file, "    return 0;\n");
        fprintf(temp_file, "}\n");
    }

    fclose(temp_file);
    fclose(file);

    // Check the generated C code
    temp_file = fopen(TEMP_C_FILE, "r");
    printf("Generated C code:\n");
    while (fgets(line, sizeof(line), temp_file)) {
        printf("%s", line);
    }
    fclose(temp_file);

    // Compile the temporary C file with the -mconsole flag for console apps
    char compile_command[MAX_LENGTH];
    snprintf(compile_command, sizeof(compile_command), "gcc -mconsole %s -o %s 2>&1", TEMP_C_FILE, TEMP_EXECUTABLE);
    int compile_status = system(compile_command);
    if (compile_status != 0) {
        fprintf(stderr, "Compilation failed with status %d\n", compile_status);
        return;
    }

    // Run the compiled executable
    printf("Running the program...\n");
    int run_status = system(TEMP_EXECUTABLE);
    if (run_status != 0) {
        fprintf(stderr, "Execution failed with status %d\n", run_status);
        return;
    }

    // Clean up temporary files
    remove(TEMP_C_FILE);
    remove(TEMP_EXECUTABLE);
}

// Main function
int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <filename>.Cwedish\n", argv[0]);
        return 1;
    }

    // Read and execute from the specified file
    read_and_execute_file(argv[1]);

    return 0;
}
