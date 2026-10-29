# Glossary Map

## Contexts

- [Neome Requirements Studio](./GLOSSARY.md): the language of the skill pack itself, shared by every Consultant and Engagement
- Enterprise glossaries (`./enterprises/<enterprise>/_agent/GLOSSARY.md`): one per Enterprise, holding that business's own domain language (for example Principal, TQ, Commission order), built during grilling

## Relationships

- **Studio → Enterprise**: studio terms (Module, Requirement, Open Item) are fixed; Enterprise terms name the things inside a Module and never redefine studio terms
- **Enterprise → BRD**: each BRD renders the Enterprise glossary terms used in its Engagement as a Glossary section
