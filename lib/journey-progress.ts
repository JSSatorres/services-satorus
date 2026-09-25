/** Native scroll selects a chapter slightly before its anchor reaches the header. */
export function getChapterIndex(
  scrollOffset: number,
  chapterHeight: number,
  chapterCount: number,
): number {
  if (chapterCount <= 0 || chapterHeight <= 0 || !Number.isFinite(scrollOffset))
    return 0;
  return Math.min(
    chapterCount - 1,
    Math.max(
      0,
      Math.floor((scrollOffset + chapterHeight * 0.28) / chapterHeight),
    ),
  );
}
