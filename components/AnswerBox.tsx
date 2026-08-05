/**
 * AEO Quick Answer — Master Plan Standard 03.
 * 40–60 words, at the top of every page, written to be quoted verbatim.
 * Block 1 of the universal on-page contract.
 */
export default function AnswerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-signal bg-paper px-5 py-4 my-6 rounded-r-lg shadow-sm">
      <p className="eyebrow mb-2">The short answer</p>
      <p className="text-lg leading-snug">{children}</p>
    </div>
  );
}
