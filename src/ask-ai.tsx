import { Form, Detail, Action, LaunchProps, LocalStorage} from "@raycast/api";
import { useEffect, useState} from "react";

interface CommandArguments {
  query: string;
}

export default function Command(props: LaunchProps<{ arguments: CommandArguments }>) {
  const { query } = props.arguments;

  return <Detail markdown={`# You entered: ${query}`} />;
}