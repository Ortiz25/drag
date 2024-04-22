function JSONtoDotNotation(json) {
  const dotNotation = {};

  json.nodes.forEach((node) => {
    const { id, label, shape } = node;

    dotNotation[`nodes.${id}`] = { label, shape };
  });

  // Map edges
  json.edges.forEach((edge) => {
    const { id, from, to, label, color } = edge;

    dotNotation[`edges.${id}`] = { from, to, label, color };
  });

  return dotNotation;
}

const json = {
  nodes: [
    { id: "start", label: "User clicks 'Build itinerary'" },
    {
      id: "displayCallout",
      label: "Display call out 'Tell us about your expected trip!'",
    },
    { id: "enterSearch", label: "User enters search prompt" },
    { id: "loading", label: "Display loading icon" },
    { id: "resultCheck", label: "Check if result is valid", shape: "diamond" },
    { id: "showSuccess", label: "Show success message and itinerary" },
    {
      id: "showError",
      label: "Error: Show error message and ask for rephrase",
    },
  ],
  edges: [
    {
      id: "start_displayCallout",
      from: "start",
      to: "displayCallout",
      label: "User action",
    },
    {
      id: "displayCallout_enterSearch",
      from: "displayCallout",
      to: "enterSearch",
      label: "User action",
    },
    {
      id: "enterSearch_loading",
      from: "enterSearch",
      to: "loading",
      label: "Submit search",
    },
    {
      id: "loading_resultCheck",
      from: "loading",
      to: "resultCheck",
      label: "Search complete",
    },
    {
      id: "resultCheck_showSuccess",
      from: "resultCheck",
      to: "showSuccess",
      label: "Valid result",
      color: "green",
    },
    {
      id: "resultCheck_showError",
      from: "resultCheck",
      to: "showError",
      label: "Invalid result",
      color: "red",
    },
  ],
};

export const dotNotation = JSONtoDotNotation(json);
