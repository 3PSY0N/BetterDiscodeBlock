interface Language {
    name: string
    aliases: Array<string>
    classNameAliases: Record<string, any>
    compiled: boolean
    compilerExtensions: Array<any>
    contains: Array<Record<string, any>>
    exports: Record<string, any>
    illegal: RegExp
    illegalRe: RegExp
    keywordPatternRe: RegExp
    keywords: Record<string, any>
    matcher: Record<string, any>
    rawDefinition: (...params: any) => any
    relevance: number
}
