export const codeTemplates = [
  {
    language: "javascript",
    code: `function scriptToExecute(input) {
    /**
     * A generic processing function.
     * Input -> Output, chainable.
     */
    
    const output = {
        result: \`processed: \${JSON.stringify(input)}\`
    };
    
    return output;
}

// Example usage
const input = { data: "example" };
console.log(scriptToExecute(input));`,
  },
  {
    language: "python",
    code: `def script_to_execute(input_data):
    """
    A generic processing function.
    The input should match the expected structure,
    and the output should be usable by the next step.
    """

    # Example placeholder logic
    output = {
        "result": f"processed: {input_data}"
    }

    return output


if __name__ == "__main__":
    sample_input = {"data": "example"}
    print(script_to_execute(sample_input))`,
  },
  {
    language: "go",
    code: `package main

import (
    "fmt"
)

// ScriptToExecute processes input and returns output
func ScriptToExecute(input map[string]interface{}) map[string]interface{} {
    output := map[string]interface{}{
        "result": fmt.Sprintf("processed: %v", input),
    }
    return output
}

func main() {
    input := map[string]interface{}{"data": "example"}
    output := ScriptToExecute(input)
    fmt.Println(output)
}`,
  },
  {
    language: "ruby",
    code: `def script_to_execute(input)
  # A generic processing function.
  # Input -> Output, chainable.

  output = {
    result: "processed: #{input}"
  }

  return output
end

# Example usage
input = { data: "example" }
puts script_to_execute(input)`,
  },
  {
    language: "r",
    code: `library(jsonlite)

# A generic processing function
script_to_execute <- function(input_data) {
  output <- list(
    result = paste("processed:", toJSON(input_data, auto_unbox = TRUE))
  )
  return(output)
}

# Example usage
input <- list(data = "example")
result <- script_to_execute(input)
print(toJSON(result, auto_unbox = TRUE, pretty = TRUE))`,
  },
];
