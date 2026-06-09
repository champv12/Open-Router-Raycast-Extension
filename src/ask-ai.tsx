import { Detail, getPreferenceValues, LaunchProps } from "@raycast/api";
import { useEffect, useState } from "react";
import { askOpenRouter } from "./api/openRouterApi";

interface Preferences {
  apiKey: string;
  model: string;
}

interface CommandArguments {
  query: string;
}

export default function Command(props: LaunchProps<{ arguments: CommandArguments }>) {
  const { query } = props.arguments;
  const preferences = getPreferenceValues<Preferences>();
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function runQuery() {
      if (!query.trim()) {
        if (isMounted) {
          setError("Please provide a prompt.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await askOpenRouter({
          apiKey: preferences.apiKey,
          model: preferences.model,
          prompt: query,
        });

        if (isMounted) {
          setAnswer(response);
          setError("");
        }
      } catch (caughtError) {
        if (isMounted) {
          const message = caughtError instanceof Error ? caughtError.message : "An unknown error occurred.";
          setError(message);
          setAnswer("");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    runQuery();

    return () => {
      isMounted = false;
    };
  }, [preferences.apiKey, preferences.model, query]);

  const markdown = error
    ? `# Error\n\n${error}`
    : `# Prompt\n\n${query}\n\n# Response\n\n${answer || "Waiting for a response..."}`;

  return <Detail isLoading={isLoading} markdown={markdown} />;
}
