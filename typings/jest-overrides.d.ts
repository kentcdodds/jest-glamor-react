declare namespace jest {
    export interface Matchers {
        toMatchSnapshotWithGlamor: (_title?: string) => void
    }
}