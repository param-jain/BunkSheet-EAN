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