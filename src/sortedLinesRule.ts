import * as Lint from "tslint";
import * as ts from "typescript";

export const BEGIN = `BEGIN SORTED BLOCK`;
export const END = `END SORTED BLOCK`;

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = `Lines between ${BEGIN} and ${END} must be sorted alphabetically`;

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new SortedLinesWalker(sourceFile, this.getOptions())
    );
  }
}

// The walker takes care of all the work.
class SortedLinesWalker extends Lint.RuleWalker {
  protected visitSourceFile(sourceFile: ts.SourceFile) {
    const { text } = sourceFile;
    const lines = text.split("\n");

    let sortedGroupStartedAt = null;
    let group = [];
    let startOfLine = 0;

    for (const line of lines) {
      if (line.includes(BEGIN) && sortedGroupStartedAt === null) {
        // Start a group
        sortedGroupStartedAt = startOfLine + line.length + 1; // for newline
      } else if (line.includes(END)) {
        // End a group:
        // - Check if the group is sorted
        // - If it isn't, create a fix replacement where the group is sorted
        if (JSON.stringify(group) !== JSON.stringify(group.sort())) {
          const start = sortedGroupStartedAt;
          const end = startOfLine;
          this.addFailure(
            this.createFailure(
              start,
              end - start,
              Rule.FAILURE_STRING,
              new Lint.Replacement(
                start,
                end - start,
                group.sort().join("\n") + "\n"
              )
            )
          );
        }
        sortedGroupStartedAt = null;
        group = [];
      } else if (sortedGroupStartedAt !== null) {
        // Continue a group
        group.push(line);
      }
      startOfLine += line.length + 1;
    }

    // call the base version of this visitor to actually parse this node
    super.visitSourceFile(sourceFile);
  }
}
