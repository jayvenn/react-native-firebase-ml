import { Alert, Button, View } from 'react-native';
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';

function ImagePicker() {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    async function verifyPermissions() {
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
    async function takeImageHandler() {
        const isPermissible = await verifyPermissions();
        if (!isPermissible) {
            return;
        }
        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });
        console.log(image);
    }
    return (
        <View>
            <View></View>
            <Button title='Take Image' onPress={takeImageHandler} />
        </View>
    );
};

export default ImagePicker;