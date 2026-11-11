import React from 'react';
import { Linking, Platform, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { palette, text as textColor, typography } from '../theme';
import { useLanguage } from '@/hooks/useLanguage';

export interface MarkdownViewerProps {
    content: string;
    isRTL?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

interface InlineSegment {
    text: string;
    isBold?: boolean;
    isItalic?: boolean;
    isCode?: boolean;
    linkUrl?: string;
}

export default function MarkdownViewer({
    content,
    isRTL: overrideRTL,
    style,
    textStyle,
}: MarkdownViewerProps) {
    const { isRTL: contextRTL } = useLanguage();
    const isRTL = overrideRTL !== undefined ? overrideRTL : contextRTL;

    if (!content) return null;

    const lines = content.split(/\r?\n/);
    const blocks: React.ReactNode[] = [];

    let lineIndex = 0;
    while (lineIndex < lines.length) {
        const rawLine = lines[lineIndex];
        const line = rawLine.trim();

        if (!line) {
            blocks.push(<View key={`empty-${lineIndex}`} style={styles.spacing} />);
            lineIndex++;
            continue;
        }

        // Horizontal Rule
        if (/^---$|^\*\*\*$|^___$/.test(line)) {
            blocks.push(<View key={`hr-${lineIndex}`} style={styles.hr} />);
            lineIndex++;
            continue;
        }

        // Headings (#, ##, ###, ####)
        const h1Match = line.match(/^#\s+(.*)/);
        if (h1Match) {
            blocks.push(
                <Text
                    key={`h1-${lineIndex}`}
                    style={[
                        styles.h1,
                        { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                    ]}
                >
                    {renderInlineText(h1Match[1], isRTL)}
                </Text>
            );
            lineIndex++;
            continue;
        }

        const h2Match = line.match(/^##\s+(.*)/);
        if (h2Match) {
            blocks.push(
                <Text
                    key={`h2-${lineIndex}`}
                    style={[
                        styles.h2,
                        { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                    ]}
                >
                    {renderInlineText(h2Match[1], isRTL)}
                </Text>
            );
            lineIndex++;
            continue;
        }

        const h3Match = line.match(/^###\s+(.*)/);
        if (h3Match) {
            blocks.push(
                <Text
                    key={`h3-${lineIndex}`}
                    style={[
                        styles.h3,
                        { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                    ]}
                >
                    {renderInlineText(h3Match[1], isRTL)}
                </Text>
            );
            lineIndex++;
            continue;
        }

        const h4Match = line.match(/^####\s+(.*)/);
        if (h4Match) {
            blocks.push(
                <Text
                    key={`h4-${lineIndex}`}
                    style={[
                        styles.h4,
                        { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                    ]}
                >
                    {renderInlineText(h4Match[1], isRTL)}
                </Text>
            );
            lineIndex++;
            continue;
        }

        // Quote Block
        const quoteMatch = line.match(/^>\s+(.*)/);
        if (quoteMatch) {
            blocks.push(
                <View
                    key={`quote-${lineIndex}`}
                    style={[
                        styles.quoteContainer,
                        isRTL ? styles.quoteRTL : styles.quoteLTR,
                    ]}
                >
                    <Text
                        style={[
                            styles.quoteText,
                            { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                        ]}
                    >
                        {renderInlineText(quoteMatch[1], isRTL)}
                    </Text>
                </View>
            );
            lineIndex++;
            continue;
        }

        // Bullet Items (- or * or •)
        const bulletMatch = line.match(/^[\-\*•]\s+(.*)/);
        if (bulletMatch) {
            blocks.push(
                <View
                    key={`bullet-${lineIndex}`}
                    style={[
                        styles.listRow,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}
                >
                    <Text style={[styles.bulletDot, isRTL ? styles.bulletDotRTL : styles.bulletDotLTR]}>
                        •
                    </Text>
                    <Text
                        style={[
                            styles.paragraphText,
                            textStyle,
                            { flex: 1, textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                        ]}
                    >
                        {renderInlineText(bulletMatch[1], isRTL)}
                    </Text>
                </View>
            );
            lineIndex++;
            continue;
        }

        // Numbered Items (1. item)
        const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
            blocks.push(
                <View
                    key={`num-${lineIndex}`}
                    style={[
                        styles.listRow,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}
                >
                    <Text style={[styles.numberPrefix, isRTL ? styles.numberPrefixRTL : styles.numberPrefixLTR]}>
                        {numberedMatch[1]}.
                    </Text>
                    <Text
                        style={[
                            styles.paragraphText,
                            textStyle,
                            { flex: 1, textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                        ]}
                    >
                        {renderInlineText(numberedMatch[2], isRTL)}
                    </Text>
                </View>
            );
            lineIndex++;
            continue;
        }

        // Standard Paragraph Line
        blocks.push(
            <Text
                key={`p-${lineIndex}`}
                style={[
                    styles.paragraphText,
                    textStyle,
                    { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
            >
                {renderInlineText(line, isRTL)}
            </Text>
        );

        lineIndex++;
    }

    return <View style={[styles.container, style]}>{blocks}</View>;
}

function renderInlineText(rawText: string, isRTL: boolean): React.ReactNode[] {
    const segments: InlineSegment[] = parseInlineSegments(rawText);

    return segments.map((seg, i) => {
        if (seg.linkUrl) {
            return (
                <Text
                    key={i}
                    style={styles.linkText}
                    onPress={() => Linking.openURL(seg.linkUrl!)}
                >
                    {seg.text}
                </Text>
            );
        }

        return (
            <Text
                key={i}
                style={[
                    seg.isBold && styles.boldText,
                    seg.isItalic && styles.italicText,
                    seg.isCode && styles.codeText,
                ]}
            >
                {seg.text}
            </Text>
        );
    });
}

function parseInlineSegments(input: string): InlineSegment[] {
    const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*\*([^*]+)\*\*\*|___([^_]+)___|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_/g;

    const result: InlineSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(input)) !== null) {
        if (match.index > lastIndex) {
            result.push({ text: input.substring(lastIndex, match.index) });
        }

        if (match[1] !== undefined && match[2] !== undefined) {
            result.push({ text: match[1], linkUrl: match[2] });
        } else if (match[3] !== undefined || match[4] !== undefined) {
            result.push({ text: match[3] || match[4], isBold: true, isItalic: true });
        } else if (match[5] !== undefined || match[6] !== undefined) {
            result.push({ text: match[5] || match[6], isBold: true });
        } else if (match[7] !== undefined) {
            result.push({ text: match[7], isCode: true });
        } else if (match[8] !== undefined || match[9] !== undefined) {
            result.push({ text: match[8] || match[9], isItalic: true });
        }

        lastIndex = pattern.lastIndex;
    }

    if (lastIndex < input.length) {
        result.push({ text: input.substring(lastIndex) });
    }

    return result;
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 6,
    },
    spacing: {
        height: 6,
    },
    hr: {
        height: 1,
        backgroundColor: palette.purple[300] || '#D8BFD8',
        marginVertical: 10,
        width: '100%',
    },
    h1: {
        ...typography.heading,
        fontSize: 22,
        fontWeight: '800',
        color: palette.purple[700],
        marginTop: 10,
        marginBottom: 4,
    },
    h2: {
        ...typography.heading,
        fontSize: 19,
        fontWeight: '700',
        color: palette.purple[500],
        marginTop: 8,
        marginBottom: 4,
    },
    h3: {
        ...typography.heading,
        fontSize: 17,
        fontWeight: '700',
        color: palette.purple[500],
        marginTop: 6,
        marginBottom: 3,
    },
    h4: {
        ...typography.heading,
        fontSize: 15,
        fontWeight: '600',
        color: palette.purple[300],
        marginTop: 4,
        marginBottom: 2,
    },
    paragraphText: {
        ...typography.body,
        fontSize: 14,
        color: textColor.primary,
        lineHeight: 22,
    },
    listRow: {
        alignItems: 'flex-start',
        marginVertical: 3,
    },
    bulletDot: {
        fontSize: 16,
        color: palette.purple[500],
        fontWeight: 'bold',
        lineHeight: 22,
    },
    bulletDotLTR: {
        marginRight: 8,
    },
    bulletDotRTL: {
        marginLeft: 8,
    },
    numberPrefix: {
        fontSize: 14,
        color: palette.purple[500],
        fontWeight: 'bold',
        lineHeight: 22,
    },
    numberPrefixLTR: {
        marginRight: 6,
    },
    numberPrefixRTL: {
        marginLeft: 6,
    },
    quoteContainer: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(155, 89, 182, 0.08)',
        borderRadius: 8,
        marginVertical: 6,
    },
    quoteLTR: {
        borderLeftWidth: 4,
        borderLeftColor: palette.purple[500],
    },
    quoteRTL: {
        borderRightWidth: 4,
        borderRightColor: palette.purple[500],
    },
    quoteText: {
        fontStyle: 'italic',
        color: palette.purple[700],
        fontSize: 14,
        lineHeight: 20,
    },
    boldText: {
        fontWeight: 'bold',
        color: textColor.primary,
    },
    italicText: {
        fontStyle: 'italic',
    },
    codeText: {
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        backgroundColor: 'rgba(0,0,0,0.06)',
        color: palette.pink[600],
        borderRadius: 4,
        paddingHorizontal: 4,
    },
    linkText: {
        color: palette.purple[500],
        fontWeight: '700',
        textDecorationLine: 'none',
    },
});
