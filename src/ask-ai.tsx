import { LaunchProps, Detail } from "@raycast/api";

interface CommandArguments {
  arguments: {
    prompt: string; // The "prompt" argument from package.json, type: text, required: true
  };
}

export default function Command(props: LaunchProps<{ arguments: CommandArguments }>) {

}
