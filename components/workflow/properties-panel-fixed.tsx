// This is a temporary fix file - the key change is in the TransformConfigWithAI component
// In the useEffect that handles lastGeneratedMapping, change:

/*
OLD CODE (line ~671):
      const fieldMappings = lastGeneratedMapping.mappings.map(m => ({
        from: m.sourceField,
        to: m.destinationField,
        transform: m.transform
      }))

NEW CODE:
      // Handle both 'mappings' (new) and 'generatedRules' (legacy) formats
      const rules = (lastGeneratedMapping.mappings || lastGeneratedMapping.generatedRules || []) as any[]
      const fieldMappings = rules.map(m => ({
        from: m.sourceField || m.from,
        to: m.destinationField || m.to,
        transform: m.transform
      }))
*/
