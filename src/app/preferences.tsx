import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, List, Divider } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import CustomAppBar from '../components/CustomAppBar';

export default function PreferencesScreen() {
    const { isDark, toggleTheme, theme } = useTheme();
    const colors = theme.colors;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <CustomAppBar title="Preferencias" />

            <View style={styles.container}>
                <List.Section>
                    <List.Subheader style={{ color: colors.textSecondary }}>Apariencia</List.Subheader>

                    <List.Item
                        title="Modo Oscuro"
                        description="Cambiar entre tema claro y oscuro"
                        titleStyle={{ color: colors.text }}
                        descriptionStyle={{ color: colors.textSecondary }}
                        left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.primary} />}
                        right={() => (
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                color={colors.primary}
                            />
                        )}
                    />
                </List.Section>

                <Divider style={{ backgroundColor: colors.border }} />

                <List.Section>
                    <List.Subheader style={{ color: colors.textSecondary }}>General</List.Subheader>
                    <List.Item
                        title="Versión de la App"
                        description="1.0.0"
                        titleStyle={{ color: colors.text }}
                        descriptionStyle={{ color: colors.textSecondary }}
                        left={props => <List.Icon {...props} icon="information" color={colors.textSecondary} />}
                    />
                </List.Section>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});