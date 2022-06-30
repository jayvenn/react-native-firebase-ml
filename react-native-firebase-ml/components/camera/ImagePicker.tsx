import {
    Alert,
    SafeAreaView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';

import {
    launchCameraAsync,
    useCameraPermissions,
    PermissionStatus,
    requestMediaLibraryPermissionsAsync,
    launchImageLibraryAsync
} from 'expo-image-picker';
import { useState } from 'react';
import { replaceBackground } from 'react-native-image-selfie-segmentation';

const screenWidth = Dimensions.get('window').width;

function ImagePicker() {
    const [image, setImage] = useState<string | undefined>();
    const [inputImage, setInputImage] = useState<string | undefined>();
    const [backgroundImage, setBackgroundImage] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    let verifyPermissions = async () => {
        if (cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions',
                'You need to grant camera permissions for this app.'
            );
            return false;
        }
        return true;
    }

    const takeImageHandler = async () => {
        const isPermissible = await verifyPermissions();
        if (!isPermissible) {
            return;
        }
        return await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });
    }

    let takenImagePreview = <Text>No image taken yet.</Text>
    let selectedImagePreview = takenImagePreview
    if (inputImage) {
        takenImagePreview = <Image style={{ width: '100%', height: '100%' }} source={{ uri: inputImage }} />;
    }
    if (backgroundImage) {
        selectedImagePreview = <Image style={{ width: '100%', height: '100%' }} source={{ uri: backgroundImage }} />;
    }

    const openImagePicker = async () => {
        const permissionResult = await requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        return await launchImageLibraryAsync();
    }

    const takeInputImage = async () => {
        let result = await takeImageHandler()
        if (!result?.cancelled) {
            setInputImage(result!.uri)
        }
    }

    const pickIntputImage = async () => {
        const result = await openImagePicker()
        if (!result?.cancelled) {
            setInputImage(result!.uri)
        }
    }

    const takeImageBackground = async () => {
        let result = await takeImageHandler()
        if (!result?.cancelled) {
            setBackgroundImage(result!.uri)
        }
    }

    const pickImageBackground = async () => {
        const result = await openImagePicker()
        if (!result?.cancelled) {
            setBackgroundImage(result!.uri)
        }
    }

    const onProcessImageHandler = async () => {
        if (inputImage && backgroundImage) {
            setLoading(true)
            await replaceBackground(
                inputImage,
                backgroundImage,
                Platform.OS === 'ios' ? 250 : 500
            )
                .then((response) => {
                    setImage(response);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                })
        }
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={{ padding: 20 }}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <View style={styles.imagePreview}>
                            {takenImagePreview}
                        </View>
                        <TouchableOpacity style={styles.button} onPress={takeInputImage} >
                            <Text style={styles.buttonTitle}>Take an Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={pickIntputImage} >
                            <Text style={styles.buttonTitle}>Pick an Image</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.box}>
                        <View style={styles.imagePreview}>
                            {selectedImagePreview}
                        </View>
                        <TouchableOpacity style={styles.button} onPress={takeImageBackground} >
                            <Text style={styles.buttonTitle}>Take an image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={pickImageBackground} >
                            <Text style={styles.buttonTitle}>Pick an Image</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={inputImage && backgroundImage
                        ? styles.button
                        : [styles.button, styles.buttonDisable]
                    } onPress={onProcessImageHandler} >
                    <Text style={styles.buttonTitle}>{loading ? 'Processing' : 'Process Image'}</Text>
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    {image ? (
                        <Image
                            style={styles.image}
                            source={{ uri: image }}
                            resizeMode='contain'
                        />
                    ) : (
                        <View style={styles.image}>
                            <Text style={styles.buttonTitle} >
                                {loading ? 'Loading' : 'Press Process Image'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ImagePicker;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'red'
    },
    box: {
        flexDirection: 'column',
    },
    imagePreview: {
        marginTop: 100,
        resizeMode: 'contain',
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 25,
        width: (screenWidth - 60) / 2,
        height: (screenWidth - 60) / 2,
    },
    button: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 15,
        marginTop: 20,
        alignItems: 'center'
    },
    buttonDisable: {
        backgroundColor: '#777777'
    },
    buttonTitle: {
        color: 'white'
    },
    inputSection: {
        paddingHorizontal: 10
    },
    imageContainer: {
        marginTop: 20
    },
    image: {
        width: screenWidth - 40,
        height: '100%',
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0
    }
});