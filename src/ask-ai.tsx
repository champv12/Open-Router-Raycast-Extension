import { getPreferenceValues, Form, Detail, Action, LaunchProps} from "@raycast/api";
import { useEffect, useState} from "react";

interface Preferences {
  apiKey: string;
};

interface CommandArguments {
  query: string;
}

export default function Command(props: LaunchProps<{ arguments: CommandArguments }>) {
  const { query } = props.arguments;               // Extract query from arguments
  const preferences = getPreferenceValues<Preferences>(); // Get API key from preferences

  if (preferences.apiKey == null) {

  }
  else {
    return (
      <Detail markdown={`# You entered: ${query}`} /> // Display the query in a Detail component
    );
  }
}