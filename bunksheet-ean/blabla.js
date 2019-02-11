screen: createBottomTabNavigator({
  ean: {
    screen: createStackNavigator({
      ean_home: { screen: EAN_Home },     
      profile: { screen: User_Profile } 
    }), 
    navigationOptions: {
      title: "E A N",
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="paper-plane" type="font-awesome" size={22} color={tintColor} />;
      },
    }
  }
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    labelStyle: { fontSize: 12 }
  }
})



/*

<Card title='Notice Number 1'>
<View style={{flexDirection:'row', justifyContent:'center', alignContent: 'center'}}>
  <Text style={{flex:1, borderWidth: 2, borderColor: '#eee', marginHorizontal: 2, padding: 15}}>Another material design solution, but much better maintained than React Native Material Design. This one has the added benefit of a nicer customization API for creating your own custom components - see the docs on this. It also has some more dynamic components like progress bars and sliders, which you may not see on other frameworks. Anything that helps save you time to build your app is always a solid benefit.</Text>
</View>
</Card>

 Rest of the app comes ABOVE the action button component 
<ActionButton buttonColor="#F9A825" buttonText="Refine" buttonTextStyle={{fontSize: 12}} size={64} positioningMode="absolute">
<View style={{flex:1, backgroundColor: '#f3f3f3'}}>
  <Icon name="format-italic" type="material" style={styles.actionButtonIcon} />
  <ActionButton.Item buttonColor='#FAD291' title="Year - Wise" onPress={() => console.log("notes tapped!")}>
    <Icon name="format-italic" type="material" style={styles.actionButtonIcon} />
  </ActionButton.Item>
  <ActionButton.Item buttonColor='#FFADF2' title="Branch - Wise" onPress={() => {}}>
    <Icon name="call-split" type="material" style={styles.actionButtonIcon} />
  </ActionButton.Item>
  <ActionButton.Item buttonColor='#A4C8F0' title="Division - Wise" onPress={() => {}}>
    <Icon name="columns" type="font-awesome" style={styles.actionButtonIcon} />
  </ActionButton.Item>
  <ActionButton.Item buttonColor='#FEA8A1' title="Batch - Wise" onPress={() => {}}>
    <Icon name="sitemap" type="font-awesome" style={styles.actionButtonIcon} />
  </ActionButton.Item>
</View>
</ActionButton>

*/