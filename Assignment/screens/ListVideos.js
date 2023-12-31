import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { FFmpegKit, ReturnCode, FFprobeKit } from 'ffmpeg-kit-react-native';
import Spinner from 'react-native-loading-spinner-overlay';


var RNFS = require("react-native-fs");

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message:
          'App needs access to your storage ' +
          'so you can compress your awesome videos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      console.log('You can use the storage');
    } else {
      console.log('Storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};


const ListVideos = ({ navigation }) => {

  const [inputFilePath, setInputFilePath] = useState("");
  const [outputFilePath, setOutputFilePath] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [compressed_video_uri, setCompressedVideoUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { // use effect hook to compress video. setOutputFilePath is not instantenoues, so we need to wait for it to be set before compressing video
    if (compressed_video_uri != "") { // if output file path is not empty, compress video
      compressVideo()
    }
  }, [compressed_video_uri]);


  const addNewVideo = (name, uri) => {
    const newId = (data.length + 1).toString();
    setData([...data, { id: newId, title: name, uri: uri }]);
  };

  const selectVideo = () => {
    //const [selectedVideo, setSelectedVideo] = useState(null); // {uri: <string>, localFileName: <string>, creationDate: <Date>}
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(videoAsset => {
      console.log(videoAsset)
      console.log(`Selected video ${JSON.stringify(videoAsset, null, 2)}`);


      path = videoAsset.path
      //addNewVideo(name, path)

      setInputFilePath(videoAsset.path)

      setName(getFileNameFromPath(videoAsset.path) + "_compressed")
      output_path = `${RNFS.CachesDirectoryPath}/_${name}_____.mp4`

      // output_path = require(output_path)

      console.log("Printing Input path")
      console.log(path)
      console.log("Printing output path")
      console.log(output_path)

      setOutputFilePath(output_path)

      setIsLoading(true)

      setCompressedVideoUri(`file://${output_path}`)



      console.log("Name")
      console.log(name)
      console.log("Printing compressed video uri")
      console.log(compressed_video_uri)


      console.log("###################################################")
    });
  };

  async function compressVideo() {
    try {
      FFmpegKit.execute(`-i ${inputFilePath} -c:v mpeg4 ${outputFilePath}`).then(async (session) => {

        const returnCode = await session.getReturnCode();

        const statistics = await session.getStatistics();
        console.log("Statistics")
        console.log(statistics)

        if (ReturnCode.isSuccess(returnCode)) {
          console.log("Successfully compressed video")
          console.log(session)
          addNewVideo(name, compressed_video_uri)
          setIsLoading(false)
          // SUCCESS

        } else if (ReturnCode.isCancel(returnCode)) {
          console.log("Compression cancelled")
          // CANCEL

        } else {
          console.log("Compression failed")
          Alert.alert('Compression failed', 'Please try again')
          setIsLoading(false)
          // ERROR
        }


      }
      )

      setOutputFilePath("")

      setCompressedVideoUri("")
    }
    catch (error) {
      console.log(error)
    };

  }

  const getFileNameFromPath = path => {
    const fragments = path.split('/');
    let fileName = fragments[fragments.length - 1];
    fileName = fileName.split('.')[0];
    return fileName;
  };

  function handleOpenVideo(name, uri) {
    navigation.push('View Videos', { title: name, uri: uri })
  }

  const renderItem = ({ item }) => (

    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleOpenVideo(item.title, item.uri)}>
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {data.length == 0 ? <Text style={{ margin: '20px' }}> No videos found </Text> :
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      }
      {/* <ActivityIndicator size="large" color="#0000ff" animating={isLoading} /> */}
      {/* Tried using ActivityIndicator but it was not working, so I used Spinner instead.
      Once I implemented and tested the code for spinner, ActivityIndicator started working. But I decided to keep spinner as it looks better. */}
      <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      <Button title="Add New Video" onPress={selectVideo} style={styles.button} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  button: {
    borderRadius: 8,
  }
});

export default ListVideos;
