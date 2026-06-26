import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from './GlassCard';

export interface CodeSnippet {
    title: string;
    code: string;
    language: string;
    description?: string;
}

interface CodeSnippetViewerProps {
    snippets: CodeSnippet[];
}

// Custom Pure-TS Tokenizer for Syntax Highlighting
export function tokenize(code: string, language: string) {
    const tokens: { type: string; value: string }[] = [];
    
    const rules: [RegExp, string][] = [
        // Comments
        [/^(?:\/\/.*|\/\*[\s\S]*?\*\/)/, 'comment'],
        // Strings
        [/^(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/, 'string'],
        // Preprocessor directives
        [/^#[a-zA-Z_]\w*/, 'preprocessor'],
        // Unreal Engine Macros
        [/^\b(?:UPROPERTY|UFUNCTION|GENERATED_BODY|UCLASS|USTRUCT|UMETA)\b/, 'macro'],
        // Common C++ / C# / JS / TS Keywords
        [/^\b(?:class|struct|public|private|protected|void|int|float|double|bool|const|constexpr|virtual|override|nullptr|if|else|for|while|return|using|namespace|import|export|from|let|var|function|async|await|interface|type|true|false|new|this|default|case|switch|static|template|typename|typedef|enum|union|extern|inline|public|private|protected)\b/, 'keyword'],
        // Common Unreal Engine and standard types
        [/^\b(?:[UAF][A-Z]\w*|int32|uint32|int64|uint64|int16|uint16|int8|uint8|FString|FName|FText|TArray|TMap|TSet|TSubclassOf|TWeakObjectPtr|TSharedPtr|TSharedRef|UObject|AActor|APawn|ACharacter|UActorComponent|USceneComponent|UGameplayStatics)\b/, 'type'],
        // Numbers
        [/^(?:\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?f?\b)/, 'number'],
        // Operators & punctuation
        [/^(?:[+\-*\/=&|<>!?:;.,()[\]{}~%^]+)/, 'operator'],
        // Words (identifiers)
        [/^[a-zA-Z_]\w*/, 'text'],
        // Whitespace (spaces, tabs, newlines)
        [/^\s+/, 'whitespace'],
        // Fallback for any single character
        [/^./, 'text']
    ];

    let remaining = code;
    while (remaining.length > 0) {
        let matched = false;
        for (const [regex, type] of rules) {
            const match = remaining.match(regex);
            if (match && match.index === 0) {
                const val = match[0];
                tokens.push({ type, value: val });
                remaining = remaining.substring(val.length);
                matched = true;
                break;
            }
        }
        if (!matched) {
            tokens.push({ type: 'text', value: remaining[0] });
            remaining = remaining.substring(1);
        }
    }
    return tokens;
}

// Token highlighting styles
const tokenStyles: Record<string, any> = {
    comment: { color: '#6A9955', fontStyle: 'italic' },
    string: { color: '#CE9178' },
    preprocessor: { color: '#C586C0' },
    macro: { color: '#BD93F9', fontWeight: 'bold' },
    keyword: { color: '#569CD6', fontWeight: 'bold' },
    type: { color: '#4EC9B0' },
    number: { color: '#B5CEA8' },
    operator: { color: '#D4D4D4' },
    text: { color: '#FFFFFF' },
    whitespace: { color: '#FFFFFF' }
};

export const CodeSnippetViewer = ({ snippets }: CodeSnippetViewerProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    if (!snippets || snippets.length === 0) return null;

    const activeSnippet = snippets[activeIndex];

    // Split code by newlines, keeping the tokenized lines
    const getLines = (code: string, language: string) => {
        const tokens = tokenize(code, language);
        const lines: { type: string; value: string }[][] = [[]];
        
        tokens.forEach(token => {
            if (token.type === 'whitespace' && token.value.includes('\n')) {
                const parts = token.value.split('\n');
                // First part goes to current line
                if (parts[0]) {
                    lines[lines.length - 1].push({ type: 'whitespace', value: parts[0] });
                }
                // Add empty lines for each subsequent newline
                for (let i = 1; i < parts.length; i++) {
                    lines.push([]);
                    if (parts[i]) {
                        lines[lines.length - 1].push({ type: 'whitespace', value: parts[i] });
                    }
                }
            } else {
                lines[lines.length - 1].push(token);
            }
        });
        
        return lines;
    };

    const handleCopy = () => {
        if (Platform.OS === 'web') {
            navigator.clipboard.writeText(activeSnippet.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const lines = getLines(activeSnippet.code, activeSnippet.language);

    return (
        <View style={styles.container}>
            {/* Tab Navigation if multiple snippets */}
            {snippets.length > 1 && (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.tabsContainer}
                >
                    {snippets.map((snip, index) => (
                        <TouchableOpacity
                            key={`snip-tab-${index}`}
                            style={[
                                styles.tab,
                                activeIndex === index && styles.tabActive
                            ]}
                            onPress={() => {
                                setActiveIndex(index);
                                setCopied(false);
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.tabText,
                                activeIndex === index && styles.tabTextActive
                            ]}>
                                {snip.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <GlassCard style={styles.card} intensity={15}>
                {/* Code Header */}
                <View style={styles.header}>
                    <View style={styles.headerInfo}>
                        <Text style={styles.titleText}>{activeSnippet.title}</Text>
                        <Text style={styles.languageBadge}>{activeSnippet.language.toUpperCase()}</Text>
                    </View>
                    
                    {Platform.OS === 'web' && (
                        <TouchableOpacity 
                            style={styles.copyBtn} 
                            onPress={handleCopy}
                            activeOpacity={0.7}
                        >
                            {copied ? (
                                <View style={styles.copyInner}>
                                    <Check color={colors.primary} size={15} style={{ marginRight: 4 }} />
                                    <Text style={styles.copyText}>Copied!</Text>
                                </View>
                            ) : (
                                <View style={styles.copyInner}>
                                    <Copy color={colors.textMuted} size={15} style={{ marginRight: 4 }} />
                                    <Text style={styles.copyText}>Copy</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Description if present */}
                {activeSnippet.description ? (
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>{activeSnippet.description}</Text>
                    </View>
                ) : null}

                {/* Code editor container */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={styles.codeScrollViewHorizontal}
                >
                    <View style={styles.codeBlock}>
                        {lines.map((lineTokens, lineIdx) => (
                            <View key={`line-${lineIdx}`} style={styles.codeLine}>
                                {/* Line numbers */}
                                <Text style={styles.lineNumber}>{lineIdx + 1}</Text>
                                
                                {/* Token list */}
                                <Text style={styles.lineContent}>
                                    {lineTokens.length === 0 ? ' ' : lineTokens.map((tok, tokIdx) => (
                                        <Text 
                                            key={`tok-${tokIdx}`} 
                                            style={[styles.baseCodeText, tokenStyles[tok.type]]}
                                        >
                                            {tok.value}
                                        </Text>
                                    ))}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </GlassCard>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 8,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    tabActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: '#fff',
    },
    tabText: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#fff',
    },
    card: {
        padding: 0,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        flexWrap: 'wrap',
    },
    titleText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
    },
    languageBadge: {
        fontSize: 10,
        fontWeight: '800',
        color: colors.text,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        letterSpacing: 0.5,
    },
    copyBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    copyInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    copyText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
    },
    descriptionContainer: {
        padding: 14,
        backgroundColor: 'rgba(255,255,255,0.01)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
    },
    descriptionText: {
        fontSize: 13,
        color: colors.textMuted,
        lineHeight: 18,
    },
    codeScrollViewHorizontal: {
        width: '100%',
    },
    codeBlock: {
        paddingVertical: 16,
        minWidth: '100%',
    },
    codeLine: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
    },
    lineNumber: {
        width: 32,
        textAlign: 'right',
        marginRight: 16,
        fontSize: 12,
        fontFamily: Platform.select({ ios: 'CourierNewPSMT', default: 'monospace' }),
        color: '#555555',
        userSelect: 'none', // Prevent line numbers from being copied on web
    } as any,
    lineContent: {
        flex: 1,
    },
    baseCodeText: {
        fontSize: 13,
        fontFamily: Platform.select({ ios: 'CourierNewPSMT', default: 'monospace' }),
        lineHeight: 18,
    },
});
