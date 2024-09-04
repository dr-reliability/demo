import ruamel.yaml

# Initialize YAML object
yaml = ruamel.yaml.YAML()

# Words not to capitalize unless they are the first or last word
lowercase_words = {
    "a",
    "an",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "the",
    "in",
    "on",
    "at",
    "by",
    "to",
    "with",
    "up",
    "off",
}


# Function to capitalize titles properly in Title Case
def capitalize_title(title):
    words = title.split()
    new_title = []

    for i, word in enumerate(words):
        # Capitalize first and last word, or if it's not in lowercase_words
        if i == 0 or i == len(words) - 1 or word.lower() not in lowercase_words:
            new_title.append(word.capitalize())
        else:
            new_title.append(word.lower())

    return " ".join(new_title)


# Load the YAML file
with open("public/papers2.yml", "r") as file:
    data = yaml.load(file)

# Iterate over each entry in the YAML data
for paper in data:
    if "Title" in paper:
        # Check if Title is a string and apply capitalization
        if isinstance(paper["Title"], str):
            paper["Title"] = capitalize_title(paper["Title"])
        # If the Title field is a dict, apply capitalization to its values
        elif isinstance(paper["Title"], dict):
            paper["Title"] = {
                key: capitalize_title(value) for key, value in paper["Title"].items()
            }

# Write the updated YAML back to the file
with open("public/papers2_updated.yml", "w") as file:
    yaml.dump(data, file)

print("Titles have been capitalized in Title Case and saved to papers2_updated.yml")
