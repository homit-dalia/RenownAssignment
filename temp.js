
function App () {
    const dispatch = useDispatch();
    const [currentVideo, setVideo] = useState(null);
    const videoList = useSelector(state => state.app.videoList);
    const queue = useSelector(state => state.app.queue);
  
    useEffect(() => {
      dispatch(getVideosApi());
      dispatch(uploadNext(true));
    }, []);
  
    const renderItem = ({ item }) => {
      const isUploading = (queue || []).find(x => x.uuid === item.uuid);
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => setVideo(item)}>
          { isUploading ? <Text>Video Uploading <ActivityIndicator size="small" color="black"/></Text> : null}
          <ImageBackground
            source={{ uri: `data:image/gif;base64,${item.thumbnail}` }}
            style={styles.imageStyle}
            poster={item.thumbnail}
          />
        </TouchableOpacity>
      )
    };
  
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <UploadButton />
  
          <FlatList
            data={videoList || []}
            renderItem={renderItem}
            keyExtractor={item => item.uuid}
          />
        </SafeAreaView>
  
        {
        currentVideo ? (
          <Modal visible onDismiss={() => setVideo(null)} transparent>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Video
                  source={{ uri: currentVideo.external_path || currentVideo.local_path }}
                  style={styles.videoStyle}
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={() => setVideo(null)}><Text>Close</Text></TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : null
      }
      </>
    );
  };
