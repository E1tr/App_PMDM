import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../contexts/ThemeContext';

interface QRScannerProps {
    onScanned: (data: string) => void;
    onClose: () => void;
}

export default function QRScanner({ onScanned, onClose }: QRScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { theme } = useTheme();
    const colors = theme.colors;

    if (!permission) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Cargando cámara...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.message, { color: colors.text }]}>
                    Necesitamos acceso a la cámara
                </Text>
                <Button mode="contained" onPress={requestPermission}>
                    Permitir acceso
                </Button>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        onScanned(data);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="close"
                    size={28}
                    onPress={onClose}
                    iconColor="#fff"
                    style={styles.closeButton}
                />
            </View>

            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                </View>
            </CameraView>

            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text, textAlign: 'center', marginBottom: 16 }}>
                    Apunta al código QR
                </Text>
                {scanned && (
                    <Button mode="contained" onPress={() => setScanned(false)}>
                        Escanear de nuevo
                    </Button>
                )}
            </View>
        </View>
    );
}

const { width, height } = Dimensions.get('window');
const scanAreaSize = width * 0.7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    closeButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: scanAreaSize,
        height: scanAreaSize,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    footer: {
        padding: 20,
    },
    message: {
        textAlign: 'center',
        marginBottom: 16,
    },
});
