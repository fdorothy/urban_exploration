const urbanDisk = () => ({
  roomId: 'bathroom', // Set this to the ID of the room you want the player to start in.
  rooms: [
    {
      id: 'bathroom',
      name: 'Bathroom',
      desc: `There's a door to the NORTH.\nTutorial: Type GO NORTH to leave the bathroom.\nTutorial: Type ITEMS to see a list of items in the room.`,
      music: '',
      onLook: () => {
        if (getRoom('bathroom').smelly) {
          println("The bathroom stinks")
        }
      },
      items: [
        {
          name: 'door',
          desc: 'It leads NORTH.',
          onUse: () => println(`Type GO NORTH to try the door.`),
        },
        {
          name: 'toilet',
          desc: `The only TOILET in your 2 bedroom apartment.`,
          onUse: () => {
            println(`You use the toilet and flush it afterwards. The room is now smelly.`)
            getRoom('bathroom').smelly = true
          }
        }
      ],
      exits: [
        {
          dir: 'north',
          id: 'living_room',
        },
      ],
    },
    {
      id: 'living_room',
      name: 'Living Room',
      desc: `The living room is sparsely furnished. WALTER sits on a couch across from the TV. To the SOUTH is the bathroom. To the NORTH is the kitchen. To the EAST is the garage.`,
      music: '',
      exits: [
        {
          dir: 'south',
          id: 'bathroom',
        },
        {
          dir: 'east',
          id: 'garage',
        },
        {
          dir: 'north',
          id: 'kitchen',
        },
      ],
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      desc: `There is a pile of dirty dishes in the SINK. You think you see a cockroach scurry into the CABINETS as the light turned on. The sound of your tv plays to the SOUTH.`,
      music: '',
      exits: [
        {
          dir: 'south',
          id: 'living_room',
        },
      ],
    },
    {
      id: 'garage',
      name: 'Garage',
      desc: `The sound of cars speeding by on the highway outside echoes through the parking garage. Your CAR is a few rows down on the right. Your apartment is to the WEST`,
      music: '',
      exits: [
        {
          dir: 'west',
          id: 'living_room',
        },
      ],
    }
  ],
});
