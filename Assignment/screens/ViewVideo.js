import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import Video from 'react-native-video'


const ViewVideo = ({ route }) => {

  const { uri } = route.params;

  console.log("ViewVideo Final URI")
  console.log(uri)
  return (

    
      <Video source={{ uri: uri }}   // Can be a URL or a local file.
        ref={(ref) => {
          this.player = ref
        }}                                      // Store reference
        //onBuffer={this.onBuffer}                // Callback when remote video is buffering
        onError={this.videoError}               // Callback when video cannot be loaded
        style={styles.backgroundVideo} 
        controls={true}
        paused={false}
        fullscreen={true}
        resizeMode="cover"
      />


  )
}

export default ViewVideo

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})