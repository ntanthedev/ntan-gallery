import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type Props = {
  content: string | null;
};

export function FriendLetter({ content }: Props) {
  if (!content) {
    return (
      <p className="text-sm text-muted-foreground">
        Hiện chưa có thư nào cho hồ sơ này.
      </p>
    );
  }

  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-muted-foreground prose-strong:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

