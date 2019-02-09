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

*/