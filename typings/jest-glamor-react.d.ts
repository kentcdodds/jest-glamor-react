// Type definitions for jest-glamor-react
// Project: https://github.com/kentcdodds/jest-glamor-react

/// <reference path="jest-overrides.d.ts" />

// the folowing are copied from jests types as they are not exported

interface MatcherUtils {
    readonly isNot: boolean;
    utils: {
        readonly EXPECTED_COLOR: string;
        readonly RECEIVED_COLOR: string;
        ensureActualIsNumber(actual: any, matcherName?: string): void;
        ensureExpectedIsNumber(actual: any, matcherName?: string): void;
        ensureNoExpected(actual: any, matcherName?: string): void;
        ensureNumbers(actual: any, expected: any, matcherName?: string): void;
        /** get the type of a value with handling of edge cases like `typeof []` and `typeof null` */
        getType(value: any): string;
        matcherHint(matcherName: string, received?: string, expected?: string, options?: { secondArgument?: string, isDirectExpectCall?: boolean }): string;
        pluralize(word: string, count: number): string;
        printExpected(value: any): string;
        printReceived(value: any): string;
        printWithType(name: string, received: any, print: (value: any) => string): string;
        stringify(object: {}, maxDepth?: number): string;
    }
}

interface ExpectExtendMap {
    [key: string]: (this: MatcherUtils, received: any, actual: any) => { message: () => string, pass: boolean };
}

interface SnapshotSerializerOptions {
    callToJSON?: boolean;
    edgeSpacing?: string;
    spacing?: string;
    escapeRegex?: boolean;
    highlight?: boolean;
    indent?: number;
    maxDepth?: number;
    min?: boolean;
    plugins?: Array<SnapshotSerializerPlugin>
    printFunctionName?: boolean;
    theme?: SnapshotSerializerOptionsTheme;

    // see https://github.com/facebook/jest/blob/e56103cf142d2e87542ddfb6bd892bcee262c0e6/types/PrettyFormat.js
}
interface SnapshotSerializerOptionsTheme {
    comment?: string;
    content?: string;
    prop?: string;
    tag?: string;
    value?: string;
}
interface SnapshotSerializerColor {
    close: string;
    open: string;
}
interface SnapshotSerializerColors {
    comment: SnapshotSerializerColor;
    content: SnapshotSerializerColor;
    prop: SnapshotSerializerColor;
    tag: SnapshotSerializerColor;
    value: SnapshotSerializerColor;
}

interface SnapshotSerializerPlugin {
    print(val:any, serialize:((val:any) => string), indent:((str:string) => string), opts:SnapshotSerializerOptions, colors: SnapshotSerializerColors) : string;
    test(val:any) : boolean;
}

declare const matcher: ExpectExtendMap
declare const serializer: SnapshotSerializerPlugin


export {
    matcher,
    serializer,
}