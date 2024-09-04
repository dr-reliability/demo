import yaml


def transform_yaml(input_file, output_file):
    # Load the YAML file
    with open(input_file, "r") as file:
        projects = yaml.load(file, Loader=yaml.FullLoader)

    # Define the transformation process
    transformed = []
    for project in projects:
        new_project = {
            "Num": str(project.get("Num")),
            "Title": project.get("Title"),
            "Authors": project.get("Authors"),
            "Venue": project.get("Venue"),
            "Venue Abrev.": project.get("Venue Abrev."),
            "Field": project.get("Field"),
            "Year": str(project.get("Year")),
            "FirstAuthor": project.get("FirstAuthor"),
            "BibIdentifier": project.get("BibIdentifier"),
            "FirstAuthorBib": project.get("FirstAuthorBib"),
            "Order": project.get("Order"),
            "Group": project.get("Group"),
            "doi": project.get("doi"),
            "Image": f"image{project.get('Num')}.png",  # Assuming images are named according to the project number
            "Tags": {
                "GroupName": project.get("GroupName"),
                "Preprocessing": project.get("Preprocessing"),
                "Dimensionality Reduction": project.get("Dimensionality Reduction"),
                "Quantitative Evaluation": project.get("Quantitative Evaluation"),
                "Visualization": project.get("Visualization"),
                "inaccurate": project.get("inaccuate"),
                "suboptimal": project.get("suboptimal"),
                "unstable": project.get("unstable"),
                "uninterpretable": project.get("uninterpretable"),
                "unscalable": project.get("unscalable"),
                "incomplete": project.get("incomplete"),
                "irreflective": project.get("irrefective"),
                "uninformed": project.get("uninformed"),
                "Enhance reliability": project.get("Enhance reliability"),
                "Enhance awareness": project.get("Enhance awareness"),
                "Enhance Approachability": project.get("Enhance Approchability"),
                "Improvements on DR": project.get("Improvements on DR"),
                "Improvements of Evaluation": project.get("Improvements of Evaluation"),
                "Visualization Stage Solutions": project.get(
                    "Visualization Stage Solutions"
                ),
                "DR framework": project.get("DR framework"),
                "Visual Analytics System": project.get("Visual Analytics System"),
                "Literature Review": project.get("Literature Review"),
                "Human-Centered Experiment": project.get("Human-Centered Experiment"),
                "Computational Experiment": project.get("Computaional Experiment"),
            },
            "Detail": f"Detailed description of {project.get('Title')}",
        }
        transformed.append(new_project)

    # Save the transformed data back to a YAML file
    with open(output_file, "w") as file:
        yaml.dump(transformed, file, default_flow_style=False, sort_keys=False)


# Example usage
transform_yaml("public/papers.yml", "public/papers2.yml")
