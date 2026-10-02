export interface AxoSlide {
  src: string;
  caption: string;
  pdfUrl: string;
}

export interface CamPos {
  lat: number; lng: number; height: number; pitch: number; heading: number;
}

export interface ThumbItem {
  src: string;
  caption: string;
  camPos?: CamPos;
}

export interface PanelContent {
  period?: string;
  programme?: string;
  units?: string;
  description?: string;
  axos?: AxoSlide[];
  thumbs?: ThumbItem[];
}

export const PANEL_CONTENT: Record<number, PanelContent> = {
  1: {
    period: '1921–1930',
    programme: 'Social housing',
    axos: [
      {
        src: '/images/1/axo-0.jpg',
        caption: '03.2223  Florian Holtbernd, Hidde Schunselaar, Floriaan Troost',
        pdfUrl: 'https://drive.google.com/file/d/10ptJC4WJ2m16n1MXARsnV7T5YbACR8-s/view',
      },
    ],
    thumbs: [
      { src: '/images/1/thumb-0.jpg', caption: '01.1  Sketches of window frames (1921). Collectie Het Nieuwe Instituut STAXpf 100.2' },
      { src: '/images/1/thumb-1.jpg', caption: '01.2  Van Kessel, E., & Kuperus, M.S. (1990). Architect Margaret Staal-Kropholler. Uitgeverij 010 Publishers.' },
      { src: '/images/1/thumb-2.jpg', caption: '02.1  Holendrechtstraat. Stadsarchief Amsterdam (1932)' },
      { src: '/images/1/thumb-3.jpg', caption: '02.2  Van Kessel, E., & Kuperus, M (1990). Architect Margaret Staal-Kropholler. Uitgeverij 010 Publishers. p. 34.' },
      { src: '/images/1/thumb-4.jpg', caption: '02.3  Photograph by Hidde Schunselaar (2023)' },
    ],
  },
  3: {
    period: '1941–1950',
    programme: 'Housing for single women',
    description: `Located at the Korte Gezenstraat, Amsterdam, Oranjehof accommodated 148 single women, consisting of mostly completely independent one-person housing units, providing them a real house of their own, with each unit having an individual front door.

Women in a similar relational and working status were often bound to live in the less liberated, dependent living situation of sharing a living with a landlady. Through the combination of this individual living space and shared amenities the complex empowered single working women and gave them the possibility to be financially independent.`,
    axos: [
      {
        src: '/images/3/axo-0.jpg',
        caption: '03.2223  Floris Boerma, Josephine Busman, Niké te Brinke',
        pdfUrl: 'https://drive.google.com/file/d/165nEfWOmW1k6ELj6dGVpU1LAKMANkOA3/view',
      },
      {
        src: '/images/3/axo-1.jpg',
        caption: '03.2425  Lucija Veble, Anna Teuton, Cinde van Gool, Suzanne Erenst',
        pdfUrl: 'https://drive.google.com/file/d/10A54qfpEUtZNrG34pP07SU6IT_MBtT8Z/view',
      },
    ],
    thumbs: [
      { src: '/images/3/thumb-0.jpg', caption: '01.1  Cieraad (2002)' },
      { src: '/images/3/thumb-1.jpg', caption: '01.2  Cieraad (2002)' },
      { src: '/images/3/thumb-2.jpg', caption: '01.3  Nieuwe Instituut (n.d.)' },
      { src: '/images/3/thumb-3.jpg', caption: '01.4  Nieuwe Instituut (n.d.)' },
      { src: '/images/3/thumb-4.jpg', caption: '02.1  Beeldbank, Amsterdam (1956)' },
      { src: '/images/3/thumb-5.jpg', caption: '02.2  Beeldbank, Amsterdam (1956)' },
      { src: '/images/3/thumb-6.jpg', caption: '02.3  Beeldbank, Amsterdam (1956)' },
    ],
  },
  4: {
    description: `The RVS flat, by some called the Hunkerbunker because of the fact that it houses single working women, was built in 1958. The idea to house single working women, however, was made in 1938 when women’s associations came together to accommodate this need.

After the Second World War and the bombing of Rotterdam in 1940, the municipality had other priorities, namely the housing of families. After multiple proposals, the municipality agreed to Jansen’s design only if it included housing for incomplete families as well as single women.

To accommodate the different needs of these groups, the flat is equipped with facilities like a personal kitchen with a refrigerator and an exterior grocery drop-off box to make the lives of the people in it as easy as possible.`,
    axos: [
      {
        src: '/images/4/axo-0.jpg',
        caption: '03.2223  Eduards Lasmanis, Jilles Rodenburg, Wouter van Oekel',
        pdfUrl: 'https://drive.google.com/file/d/15db23oTrvRaAP6Ew5Mai8btf4qcQqN4c/view',
      },
    ],
    thumbs: [
      { src: '/images/4/thumb-0.jpg', caption: '01.1  unknown' },
      { src: '/images/4/thumb-1.jpg', caption: '01.2  Schiedam City Archive (n.d.)' },
      { src: '/images/4/thumb-2.jpg', caption: '01.3  Schiedam City Archive (n.d.)' },
      { src: '/images/4/thumb-3.jpg', caption: '01.4  Stadsarchief Rotterdam (n.d.)' },
      { src: '/images/4/thumb-4.jpg', caption: '01.5  Schiedam City Archive (n.d.)' },
      { src: '/images/4/thumb-5.jpg', caption: '02.1  Eduards Lasmanis, Jilles Rodenburg, Wouter van Oekel' },
      { src: '/images/4/thumb-6.jpg', caption: '02.2  Eduards Lasmanis, Jilles Rodenburg, Wouter van Oekel' },
      { src: '/images/4/thumb-7.jpg', caption: '02.3  Eduards Lasmanis, Jilles Rodenburg, Wouter van Oekel' },
      { src: '/images/4/thumb-8.jpg', caption: '02.4  unknown' },
    ],
  },
  6: {
    description: `Pendrecht was a prime example of urban renewal. The project was intended for 6,300 affordable homes which were proposed as a new typology and construction principle called “wooneenheden” (residential units). The housing units were repeated schematically in the plan, creating a social and inclusive neighbourhood. This was done by bringing various demographics together and creating collective spaces in between the residential units, such as public gardens and wide sidewalks where children could play safely. The elderly housing was designed by clustering day-to-day activities around the hallway to maximize accessibility and, apart from large windows in the facade, interior windows allowed more light into the living spaces.

Lotte Stam-Beese executed this project working at the Dienst van Stadsontwikkeling, but also cooperating at the architectural group, De Opbouw, both positioned in Rotterdam. The first design sketches were made for De Opbouw to present at the 7th CIAM-congress in Bergamo, 1949. They were heavily influenced by De Opbouw-member, J.B. Bakema who, among others, initiated the new typology before the Second World War. The new typology was considered an example for future housing projects and influenced the following housing districts in the urban design planning of Rotterdam.

Nowadays, Pendrecht is being reconstructed to meet current building regulations, but also to mix up the demographic inhabitants to meet current social requirements. Big neighbourhoods are being replaced with brand new owner-occupied houses, not particularly following the original vision.`,
    axos: [
      {
        src: '/images/6/axo-0.jpg',
        caption: '03.2223  Aljona Kourchine, Martina Gjermeni, Merel Schouten',
        pdfUrl: 'https://drive.google.com/file/d/1HaihS33131VwtCQsWtBnSpA4Za7FnhDw/view',
      },
    ],
    thumbs: [
      { src: '/images/6/thumb-0.jpg', caption: '01.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/6/thumb-1.jpg', caption: '01.2  Stadsarchief Rotterdam, 1955' },
      { src: '/images/6/thumb-2.jpg', caption: '02.1  Oosterhof, 2018' },
      { src: '/images/6/thumb-3.jpg', caption: '02.2  Nieuwe Instituut (n.d.)' },
    ],
  },
  7: {
    period: '1971–1980',
    programme: 'Elderly care',
    description: `De Zonnetrap is like a miniature city due to its multifunctional concept contrasting with the post-war era's architecture. The original building had a central public hallway with amenities like a shoe mender and hairdresser; intending to promote a lively environment with a diversity of users and urban functions spread over various storeys. Indoor balconies also added to this concept.

The richness of the pathways intersecting in an organized manner reflects the coexistence and interaction of people of different ages, occupations and living orientations. At the same time, pathways within the apartments point to their terraced balconies. All apartments are arranged to maximize the equality of sunlight absorption for the different occupants. The receding lines they create allow the building to face the street and the community outside in a more modest and lively way than the usual vertical facade lines. Luzia and Enrico have created a complex that uses pathways to project the architectural ideals of inclusivity, equality, and social care, constructing a creative and idealized model of small-scale social living within a single architectural volume.`,
    axos: [
      {
        src: '/images/7/axo-0.jpg',
        caption: '03.2223  Anouk De Graaff, Elke Modders, Luiying Cheng',
        pdfUrl: 'https://drive.google.com/file/d/1aXQ7djCPG-IEjDSW6JjHVTfL227fVap3/view',
      },
      {
        src: '/images/7/axo-1.jpg',
        caption: '03.2425  Jacob Meyers, Daniel Friedrich, Tim Ipkovits, James Burkhalter',
        pdfUrl: 'https://drive.google.com/file/d/1HidSP4bMvxO33jcTBLcLrQcjxfWBPWsP/view',
      },
    ],
    thumbs: [
      { src: '/images/7/thumb-0.jpg', caption: '01.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/7/thumb-1.jpg', caption: '01.2  Nieuwe Instituut (n.d.)' },
      { src: '/images/7/thumb-2.jpg', caption: '01.3  Nieuwe Instituut (n.d.)' },
      { src: '/images/7/thumb-3.jpg', caption: '01.4  Nieuwe Instituut (n.d.)' },
      { src: '/images/7/thumb-4.jpg', caption: '02.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/7/thumb-5.jpg', caption: '02.2  Nieuwe Instituut (n.d.)' },
      { src: '/images/7/thumb-6.jpg', caption: '02.3  Nieuwe Instituut (n.d.)' },
    ],
  },
  8: {
    period: '1981–1990',
    programme: 'Social housing',
    units: '21–50',
    description: `The Nieuwe Houttuinen is a social housing project, which was atypical for its time. The white finishing of the thirty houses was used for the first time in social housing, and this was an unusual choice compared to brickwork. Due to this proposal, these houses are also in contrast with their surroundings.

However, the project still deeply respected the urban context. The block is lower on the north side, allowing more sunlight to enter the street. Also, the social context was taken into account. Social interaction was stimulated by the design of a traffic-free streetside, which isn't fully public, and houses that aren't fully private, due to the semi-private bedroom and kitchen that are facing the streetside.`,
    axos: [
      {
        src: '/images/8/axo-0.jpg',
        caption: '03.2223  Apostolos Spyropoulos, Jelte Savonije, Joyce de Louw',
        pdfUrl: 'https://drive.google.com/file/d/1n-11VjxJn_43S-i9CN_fYea4qKBjsLcL/view',
      },
    ],
    thumbs: [
      { src: '/images/8/thumb-0.jpg', caption: '01.1  unknown' },
      { src: '/images/8/thumb-1.jpg', caption: '02.1  unknown' },
      { src: '/images/8/thumb-2.jpg', caption: '02.2  unknown' },
      { src: '/images/8/thumb-3.jpg', caption: '02.3  unknown' },
    ],
  },
  9: {
    description: `The Woondok housing block in Rotterdam can be considered a translation of the Hartsuykers’ ideas on housing floorplans to an urban scale. The couple always designed to be inclusive towards different types of inhabitants, with a focus on the experience of the living space.

Luzia describes this as experiencing space in the fourth dimension, through time, movement and activity. An open layout of the living room and kitchen spaces provides connections between activities like cooking and watching playing children.

There is a certain flexibility in the floorplans that allows for customisation by the residents. The housing block serves as a base from where inhabitants can freely roam the city.`,
    axos: [
      {
        src: '/images/9/axo-0.jpg',
        caption: '03.2223  Emma Seidel, Filipa van der Laan, Victor Loop',
        pdfUrl: 'https://drive.google.com/file/d/19EXZdm28rYq3STCtVqIVi_S8ABAuoMyv/view',
      },
    ],
    thumbs: [
      { src: '/images/9/thumb-0.jpg', caption: '01.1  Stadsarchief Rotterdam (n.d.)' },
      { src: '/images/9/thumb-1.jpg', caption: '01.2  unknown' },
      { src: '/images/9/thumb-2.jpg', caption: '01.3  unknown' },
      { src: '/images/9/thumb-3.jpg', caption: '02.1  De Herder, 1986' },
    ],
  },
  10: {
    period: '1981–1990',
    programme: 'Social housing for young people',
    units: '51–100',
    description: `The Housing for young people on Kruisplein was the result of a competition in which many of the proposals came from young architects. The competition was done in two phases, each with different specifications and objectives. The project provided social housing for lower-income individuals in Rotterdam's center, focusing on cooperative living for young singles rather than traditional family units.

The first phase of the competition, which received 196 entries, was more theoretical and experimental with a high emphasis on unit flexibility. The second phase brought the plans closer to reality, considering aspects such as minimum area requirements and clearly differentiated dwellings. The winning proposal was submitted by a group of three students from the Technische Hogeschool Delft who later formed the architecture firm Mecanoo as a result of this win.

At the time of the competition, individual and collective housing was not as common as it is now, with the housing stock mostly oriented towards families. The novelty of this little explored form of housing meant that there were a broad range of possible visions which appeared in the process of the competition. There were three different unit types to cater to the diverse range of people who would live in the building. This included a fully private unit, a unit with almost all facilities being collective, and a unit with both private and collective facilities.

The winning proposal consists of a ten-story structure which sits adjacent to a pre-existing neighbouring building and a smaller curved five-story building. These two different scales allowed the project to create a bridge in the urban fabric between the Old West neighbourhood and the post-war Bouwcentrum. Between the two buildings there is a semi-private square which acts as an oasis in an otherwise busy part of the city. The building is now used as student accommodation, providing a convenient living space.`,
    axos: [
      {
        src: '/images/10/axo-0.jpg',
        caption: '03.2324  Shanice Soeroredjo, William Frørup, Wanja Franssen, Maksymilian Janus',
        pdfUrl: 'https://drive.google.com/file/d/16a_Mr4Fj8fEipY6mdxI-6itl0uw6Brmk/view',
      },
    ],
    thumbs: [
      { src: '/images/10/thumb-0.jpg', caption: '01.1  Phase one Ozoo proposal by Mecanoo' },
      { src: '/images/10/thumb-1.jpg', caption: '01.2  Phase one Ozoo proposal by Mecanoo' },
      { src: '/images/10/thumb-2.jpg', caption: '01.3  Phase one Ozoo proposal by Mecanoo' },
      { src: '/images/10/thumb-3.jpg', caption: '01.4  Axonometric drawing of Z2 unit by Mecanoo' },
      { src: '/images/10/thumb-4.jpg', caption: '02.1  Facade construction (author unknown)' },
      { src: '/images/10/thumb-5.jpg', caption: '02.2  Model of Z4 unit by Shanice Soeroredjo, William Frørup, Wanja Franssen, Maksymilian Janus' },
      { src: '/images/10/thumb-6.jpg', caption: '02.3  Author unknown' },
    ],
  },
  13: {
    period: '2001–2010',
    programme: 'Mixed-income housing',
    units: '101–200',
    description: `Silodam is a mix-used housing project in Amsterdam. It was designed by Nathalie de Vries, the co-founder of MVRDV, in 1998-2002. Aiming to serve different social groups, it not only takes individuality into account, but it also creates several collective neighbourhoods within the building. The individuality appears through diversifying both layout and façade. The building consists of 157 units with apartment types differed in size and financial categories. Correspondingly, the color and material of the façade of each unit are adapted, conveying a dynamic experience for residents. Open common spaces and the continuous circulation, show the collective life within the building.`,
    axos: [
      {
        src: '/images/13/axo-0.jpg',
        caption: '03.2223  Abrar Asag-Gau, Sijie Song, Tim Bielevelt',
        pdfUrl: 'https://drive.google.com/file/d/1sIDRj70a9aQ0m9DTW21aqsx0N8xUvSkl/view',
      },
    ],
    thumbs: [
      { src: '/images/13/thumb-0.jpg', caption: '01.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/13/thumb-1.jpg', caption: '01.2  unknown' },
      { src: '/images/13/thumb-2.jpg', caption: '01.3  unknown' },
      { src: '/images/13/thumb-3.jpg', caption: '01.4  unknown' },
      { src: '/images/13/thumb-4.jpg', caption: '02.1  unknown' },
      { src: '/images/13/thumb-5.jpg', caption: '02.2  unknown' },
      { src: '/images/13/thumb-6.jpg', caption: '02.3  unknown' },
    ],
  },
  14: {
    period: '2001–2010',
    programme: 'Housing for immigrant communities',
    description: `Le Medi, 'the middle' or 'the mediator', provides 93 ground-level attached dwellings within Rotterdam's Tussendijken neighbourhood. It aspired to provide culturally appropriate and representative housing for the large immigrant population in this neighbourhood and today hosts a diverse range of occupants.

Two research themes have been pursued: the implications of plan relocation of 'the nomadic kitchen' as a gendered space/program, and diversity in the cultural interpretation of threshold design as a transition space between public and private. These themes are intertwined in an illustration of appropriation, expanded domestic spaces and homecoming, focusing on the KSA type within Le Medi.`,
    axos: [
      {
        src: '/images/14/axo-0.jpg',
        caption: '03.2223  Amber Gorter, Jacob Levy',
        pdfUrl: 'https://drive.google.com/file/d/1LzH2sIJ2waYV9ihgybjP9Hhg92acVixQ/view',
      },
    ],
    thumbs: [
      { src: '/images/14/thumb-0.jpg', caption: '01.1  author unknown' },
      { src: '/images/14/thumb-1.jpg', caption: '02.1  author unknown' },
      { src: '/images/14/thumb-2.jpg', caption: '02.2  author unknown' },
      { src: '/images/14/thumb-3.jpg', caption: '02.3  author unknown' },
    ],
  },
  15: {
    period: '2011–2020',
    programme: 'Community-led renovation',
    units: '101–200',
    description: `The Koningsvrouwen van Landlust renovation project valued community participation, but struggled with cultural and language barriers. In response, the project team developed safe and inclusive solutions such as working with children in the renovation process, holding women-only coffee mornings, and multiple participation evenings to ensure everyone's voices were heard.

The Koningsvrouwen van Landlust project team fostered inclusivity through innovative initiatives, which allowed all voices to be heard, and the community to come together to renew the building. The success of the project underscores the significance of community participation and inclusivity in achieving shared goals.`,
    axos: [
      {
        src: '/images/15/axo-0.jpg',
        caption: '03.2223  Marion Achach, Ecelia Kastelein, Muriël de Ridder',
        pdfUrl: 'https://drive.google.com/file/d/1i3NpfZDTXtbqYkHBRMLdyJRgWEyd0DxT/view',
      },
    ],
    thumbs: [
      { src: '/images/15/thumb-0.jpg', caption: '01.1  New floorplan (author unknown)' },
      { src: '/images/15/thumb-1.jpg', caption: '01.2  Original floorplan (author unknown)' },
      { src: '/images/15/thumb-2.jpg', caption: '02.1  Photograph by Marion Achach, Ecelia Kastelein, Muriël de Ridder (2023)' },
      { src: '/images/15/thumb-3.jpg', caption: '02.2  Anna van Buren, Collection Dienst Volkshuisvesting (1937)' },
      { src: '/images/15/thumb-4.jpg', caption: '02.3  Bos en Lommer, City Archive Amsterdam' },
    ],
  },
  16: {
    period: '2001–2010',
    programme: 'Mixed social & private housing',
    units: '26',
    description: `Buurtfabriek Ruimzicht in Amsterdam, designed by Marlies Rohmer, maintains the factory typology of the former industrial area. The complex acts as a small community and does not only house several public functions on the ground floor, but also consists of 26 apartments varying from small units to bigger maisonettes, providing options for a range of residents.

The project features a mix of social and private housing, ensuring affordable options for inhabitants with varying income levels. This variety in housing options promotes diversity and ensures that the building is accessible to a wide range of people. The concrete columns will ensure modularity and flexibility.`,
    axos: [
      {
        src: '/images/16/axo-0.jpg',
        caption: '03.2223  Lise Sarda, Kim van den Bosch',
        pdfUrl: 'https://drive.google.com/file/d/1cM5MOMWv8RgTUExuocZROQNI9TEdas66/view',
      },
    ],
    thumbs: [
      { src: '/images/16/thumb-0.jpg', caption: '01.1  Sketch by Marlies Rohmer (2004)' },
      { src: '/images/16/thumb-1.jpg', caption: '02.1  Rohmer (n.d.)' },
      { src: '/images/16/thumb-2.jpg', caption: '02.2  Rohmer (n.d.)' },
      { src: '/images/16/thumb-3.jpg', caption: '02.3  Photograph by Lise Sarda (2023)' },
      { src: '/images/16/thumb-4.jpg', caption: '02.4  Photograph by Lise Sarda (2023)' },
      { src: '/images/16/thumb-5.jpg', caption: '02.5  Photograph by Lise Sarda (2023)' },
    ],
  },
  18: {
    period: '2021–2030',
    programme: 'Mixed-use social housing',
    units: '51–100',
    description: `Spaarndammerhart as the name translates in Dutch, the heart of Spaarndammer. It is in the heart of the Spaarndammerbuurt in Amsterdam. It is a housing project designed by Kort Tielens Archtecten and Marcel Lok Architecten. The project connects different layers in architecture together in one building.

The project Spaarndammerhart intersects at different layers in the city and connects these layers in one place. It is home to different people of different lifestyles and different social classes. Also, it made possible to be a home for animals, plants, trees, and the heart of nature in Amsterdam. Instead of making Amsterdam more condensed with more buildings, it created more nature. The project also has an artistic layer and relates to the neighbourhood through the contemporary Amsterdam School facade and resident participation.`,
    axos: [
      {
        src: '/images/18/axo-0.jpg',
        caption: '03.2223  Esmee Heemskerk, Oudail El Omari',
        pdfUrl: 'https://drive.google.com/file/d/1GDqYO01ond5aWYBUNtYTHjOKSTdo32q9/view',
      },
    ],
    thumbs: [
      { src: '/images/18/thumb-0.jpg', caption: '01.1  Korth Tielens Architecten (n.d.)' },
      { src: '/images/18/thumb-1.jpg', caption: '01.2  Korth Tielens Architecten (n.d.)' },
      { src: '/images/18/thumb-2.jpg', caption: '02.1  Korth Tielens Architecten (n.d.)' },
      { src: '/images/18/thumb-3.jpg', caption: '02.2  Korth Tielens Architecten (n.d.)' },
      { src: '/images/18/thumb-4.jpg', caption: '02.3  Korth Tielens Architecten (n.d.)' },
      { src: '/images/18/thumb-5.jpg', caption: '02.4  Korth Tielens Architecten (n.d.)' },
      { src: '/images/18/thumb-6.jpg', caption: '02.5  Korth Tielens Architecten (n.d.)' },
    ],
  },
  19: {
    period: '1971–1980',
    programme: 'Elderly care',
    units: '51–100',
    description: `Jordaan is a district in the centre of Amsterdam. It was built in the early 17th century as part of the expansion. It was home to the working class and immigrants who came to Amsterdam due to its tolerance towards other political and religious beliefs. With time, it became an overly populated area with poor hygienic standards. Around 1900, the estimated population was around 80,000, whereas now only 20,000 people live in Jordaan. It was in the 1950s that plans were made for a large-scale demolition and reconstruction of the area. It was further a part of the urban renewal plans that were supposed to transform Amsterdam into a modern metropolis. However, these plans were largely frowned upon by the Amsterdammers, who wanted to preserve the historic city centre. Worried about the effects of the urban redevelopment plans, architect Aldo van Eyck and his followers advocated for architecture and urban planning that prioritised social connections and embraced the innovative potential of community-driven efforts. That being said, Aldo van Eyck and Theo Bosch were critical of the city council's plans. In their view, the demolitions should be kept to a minimum. The typical building lines and narrow street patterns of Amsterdam should be restored. The collaboration between the influential and efficiently organised local community group, along with the firm stance of the Van Eyck and Bosch office, resulted in a reevaluation of the city council's proposals.

The architects designed some buildings in the planning area, like Het Pentagon. Among them was also the modest elderly housing project on Rozenstraat in the Jordaan. It was an unusual location for a project like this since most retirement homes were built in new satellite towns or suburbs before. On Rozenstraat, the residents could enjoy their later stage of life in the city's centre. The development was structured around a central garden, with dwellings overlooking both the street and the garden. The architectural style and details of the building harmonise with nearby buildings, making it coherent with the surroundings and in line with the architects' new vision for Amsterdam.`,
    axos: [
      {
        src: '/images/19/axo-0.jpg',
        caption: '03.2324  Mark Caruana, Brent Burm, Fabian Wachter, Igor Sztormowski',
        pdfUrl: 'https://drive.google.com/file/d/1c3-uqN5o-b1b6W8W5P7vx2JfxsrSHq0I/view',
      },
    ],
    thumbs: [
      { src: '/images/19/thumb-0.jpg', caption: '01.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/19/thumb-1.jpg', caption: '01.2  Nieuwe Instituut (n.d.)' },
      { src: '/images/19/thumb-2.jpg', caption: '01.3  unknown' },
      { src: '/images/19/thumb-3.jpg', caption: '01.4  unknown' },
      { src: '/images/19/thumb-4.jpg', caption: '02.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/19/thumb-5.jpg', caption: '02.2  unknown' },
      { src: '/images/19/thumb-6.jpg', caption: '02.3  unknown' },
      { src: '/images/19/thumb-7.jpg', caption: '02.4  unknown' },
    ],
  },
  20: {
    period: '1981–1990',
    programme: 'Temporary housing for single parents',
    description: `Hubertushuis, designed by Aldo and Hannie van Eyck between 1973–1981, was briefed as a renovation and addition project to provide temporary housing for disadvantaged single parents in Amsterdam. Aldo, a founding member of Team 10, rebelled against what he believed to be a non-humanist approach in modern architecture. In close collaboration with the Hubertus Association, Aldo and Hannie were able to connect a complex site of three buildings by bridging them along a new transverse axis. A brightly coloured steel and glass staircase in between the old and the new building ensured what was previously a divider is now a unifying link.

Architecturally, Van Eyck aimed to facilitate visual connection with the community from within whilst also providing a sense of protection and enclosure. Similarly, the Hubertus Association aimed to provide a welcoming environment for its guests whilst also recognising the temporary nature of their stay and eventual reintroduction into society. Hofjes and Beguinages are the early Dutch precedents for collective housing for women as a means of providing increased autonomy and self-governance.

As was the case with its historic counterparts, Hubertushuis was met with some contention. Its brightly coloured façade and nonconformative living style often being the topic of discussions. The architectural design itself being intersectional by nature through an understanding that many combinations of opposing phenomena can be coordinated to facilitate or hinder a resident's living experience.`,
    axos: [
      {
        src: '/images/20/axo-0.jpg',
        caption: '03.2324  Clément Taulelle, Diede Hermans, Luana Stadtmann, Ruby Matthews',
        pdfUrl: '',
      },
      {
        src: '/images/20/axo-1.jpg',
        caption: '03.2425  Jesse Wouda, Chiara, Ceylon Yazici, Jamy Hoogland',
        pdfUrl: 'https://drive.google.com/file/d/1PYZN_CpDaT1wTL4grKQxuxX0kjEOKqhR/view',
      },
      {
        src: '/images/20/axo-2.jpg',
        caption: '03.2526  Zoe Linnebank, Lucas de Vaan, Nina Kunstman, Cheyanne Hudson',
        pdfUrl: 'https://drive.google.com/file/d/1Q23q72_fQ48n-qAuHzGB_iEZemmvRKAo/view',
      },
    ],
    thumbs: [
      { src: '/images/20/thumb-0.jpg', caption: '01.1  A. van Eyck, Hubertus Huis (1986)' },
      { src: '/images/20/thumb-1.jpg', caption: '01.2  A. van Eyck, Hubertus Huis (1986)' },
      { src: '/images/20/thumb-2.jpg', caption: '01.3  Van Eyck Foundation – SK0220' },
      { src: '/images/20/thumb-3.jpg', caption: '01.4  unknown' },
      { src: '/images/20/thumb-4.jpg', caption: '01.5  Aldo + Hannie Van Eyck Archives, Leonen Aan De Vecht, The Netherlands (scanned 2024)' },
      { src: '/images/20/thumb-5.jpg', caption: '02.1  Architectuurgids, Moederhuis A. van Eyck (2006)' },
      { src: '/images/20/thumb-6.jpg', caption: '02.2  A. van Eyck, Hubertus Huis (1986)' },
      { src: '/images/20/thumb-7.jpg', caption: '02.3  A. van Eyck, Hubertus Huis (1986)' },
      { src: '/images/20/thumb-8.jpg', caption: '02.4  Aldo + Hannie Van Eyck Archives, Leonen Aan De Vecht, The Netherlands (scanned 2024)' },
      { src: '/images/20/thumb-9.jpg', caption: '02.5  Aldo + Hannie Van Eyck Archives, Leonen Aan De Vecht, The Netherlands (scanned 2024)' },
    ],
  },
  21: {
    period: '1921–1930',
    programme: 'Monastic community',
    description: `This project serves as a case study for Benedictine monastic life within a communal architectural context, emphasizing the core principle of "ora et labora" - prayer and work. The daily routine revolves around communal prayer, liturgical ceremonies, and manual labor, all aimed at nurturing spiritual growth and fostering community unity.

Located amidst the picturesque hills of Lemiers, the monastery comprises both older and newer sections, originating from 1922. Initially conceived as a replacement for a monastery in Merkelbeek, which was heavily damaged during World War I, the architectural design by German architects Dominikus Böhm and Martin Weber aimed for high aesthetic quality, though the actual construction deviated from the original plan, resulting in a quadrilateral structure with two corner towers. Over the years, the abbey saw diverse occupants, from German Benedictine monks who later served in the German army during World War II to accommodating American soldiers, political prisoners, and repatriated families from Indonesia. These transitions left the structure unfinished and unoccupied for a time.

In 1955, monks from Paulus Abbey in Oosterhout decided to relocate to this site. Benedictine monk and architect Dom Hans van der Laan oversaw the completion of the abbey, adding extensions such as the main church, a crypt, and an atrium in 1967, followed by the library, sacristy, and an open arcade surrounding a new cloister in 1986.

Characterized by a pursuit of perfect harmony through proportions and color, the design aligns with the Benedictine order's emphasis on austerity. The original building underwent modifications, including the removal and addition of various architectural elements, to achieve a cohesive and harmonious ensemble, reflective of the Benedictine spirit.`,
    axos: [
      {
        src: '/images/21/axo-0.jpg',
        caption: '03.2324  Mika Nilsson, Emilie Kirkegaard, Jean Rojanavilaivudh, Beer Van Den Broek',
        pdfUrl: 'https://drive.google.com/file/d/1br1LyTW4jZGJ8NvaNaBuVtOmVLW8tpVo/view',
      },
    ],
    thumbs: [
      { src: '/images/21/thumb-0.jpg', caption: '01.1  Dominikus Böhm, August Hoff (1962)' },
      { src: '/images/21/thumb-1.jpg', caption: '01.2  Dominikus Böhm, August Hoff (1962)' },
      { src: '/images/21/thumb-2.jpg', caption: '01.3  Abdijkerk Vaals, LJM Tummers (2005)' },
      { src: '/images/21/thumb-3.jpg', caption: '01.4  Abdijkerk Vaals, LJM Tummers (2005)' },
      { src: '/images/21/thumb-4.jpg', caption: '01.5  Hans van der Laan, Divisare (n.d.)' },
      { src: '/images/21/thumb-5.jpg', caption: '02.1  Jeroen Verrecht, Divisare (n.d.)' },
      { src: '/images/21/thumb-6.jpg', caption: '02.2  Bram Petraeus (n.d.)' },
      { src: '/images/21/thumb-7.jpg', caption: '02.3  Jeroen Verrecht, Divisare (n.d.)' },
      { src: '/images/21/thumb-8.jpg', caption: '02.4  Jeroen Verrecht, Divisare (n.d.)' },
    ],
  },
  22: {
    period: '1971–1980',
    programme: 'Social housing',
    units: '101–200',
    description: `De Kasbah stands as a testament to architectural ingenuity in the residential landscape of Hengelo, The Netherlands. Conceived and brought to life by the esteemed Dutch architect Piet Blom, this residential complex emerged between the years 1969 and 1974, boasting a distinctive ensemble of 184 pitched roof houses meticulously elevated by sturdy concrete stilts.

At its core, De Kasbah embodies an innovative vision, where the substructure was conceived not merely as a support system, but as a vibrant communal space designed to accommodate various functions ranging from professional endeavors to recreational pursuits, alongside provisions for vehicular parking and storage.

Positioned at the intersection of brutalism and Dutch structuralism, De Kasbah occupies a significant place in architectural discourse. Reflective of the zeitgeist of the 1960s and 1970s, characterized by a spirit of left-wing diversity and an embrace of the exotic, the complex symbolizes an era where migrant workers were warmly welcomed.

Piet Blom, a protégé of Aldo van Eyck, exhibited a profound inclination towards crafting playful urban environments that defied conventional housing typologies. His Urban Roof Study of 1965 proposed a vertical zoning system, wherein the ground level assumed significance as a societal nexus, fostering interaction, while the elevated structures catered to individual living spaces — encapsulating 'the small cells of the city'.`,
    axos: [
      {
        src: '/images/22/axo-0.jpg',
        caption: '03.2324  Emina Šehmehmedović, rest unknown',
        pdfUrl: 'https://drive.google.com/file/d/1YATwC4ZAz5j9Sr6G0LmHvhEk7eKtWLVy/view',
      },
    ],
    thumbs: [
      { src: '/images/22/thumb-0.jpg', caption: '01.1  unknown' },
      { src: '/images/22/thumb-1.jpg', caption: '01.2  unknown' },
      { src: '/images/22/thumb-2.jpg', caption: '01.3  unknown' },
      { src: '/images/22/thumb-3.jpg', caption: '02.1  unknown' },
      { src: '/images/22/thumb-4.jpg', caption: '02.2  unknown' },
      { src: '/images/22/thumb-5.jpg', caption: '02.3  unknown' },
    ],
  },
  23: {
    period: '1981–1990',
    programme: 'Squatted live/work community',
    units: '101–200',
    description: `The 'Woonwerkpand' Tetterode, centrally located between the Bilderdijkstraat and Da Costakade in Amsterdam, houses a large variety of homes, workplaces, and meeting spaces.

While the building hulls themselves were built in the beginning of the 20th century, we here want to tell its vibrant residential history, starting in the 1980's. The building complex itself consists of three volumes and a chimney and is connected through two aerial walkways and two inner courtyards. When in 1981 the old factory buildings were supposed to be demolished, squatters occupied the place and managed to save it. After a long fight it was officially bestowed as a residential building five years later. In addition to this functional shift, the building is nowadays recognized as a historical monument.

The architectural history of Tetterode is a story that follows a community. A community that took action in their own hands. By establishing living and working quarters that meet their own evolving needs, the users created an unique modular building design within the expanded grid of the old factory halls. The structures within this community are highly connected to the building and create the base for any architectural development. This is why for us, the characteristics of the Woonwerkpand Tetterode are not its history of an factory that has later been transformed into a residential space. They are the constant developments within the structure, initiated by its diverse users and their many and interactions.

The Woonwerkpand Tetterode shows an example of how a building can become more than a roof over your head. It can become a home, a refuge, a place for people to belong even if they might not fit in the strict "norms" our society sets. Our observations about Woonwerkpand Tetterode inspire thoughts about how the complex can be seen as a refuge for diverse communities. Thoughts that are closely connected to questions about ownership rights, spatial practises, privileges and intersectionality.`,
    axos: [
      {
        src: '/images/23/axo-0.jpg',
        caption: '03.2324  Paulina Düchting, Bas Jonker, Yishu He',
        pdfUrl: '',
      },
      {
        src: '/images/23/axo-1.jpg',
        caption: '03.2425  Klara Bergwall, Alexandra Sörman, Sandro van der Hulst, Sofia Walter',
        pdfUrl: 'https://drive.google.com/file/d/1l5P5iIfbTL50J84OfuYni6sThwUGpsB7/view',
      },
    ],
    thumbs: [
      { src: '/images/23/thumb-0.jpg', caption: '01.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/23/thumb-1.jpg', caption: '02.1  unknown' },
      { src: '/images/23/thumb-2.jpg', caption: '02.2  unknown' },
      { src: '/images/23/thumb-3.jpg', caption: '02.3  unknown' },
      { src: '/images/23/thumb-4.jpg', caption: '02.4  unknown' },
    ],
  },
  24: {
    period: '1971–1980',
    programme: 'Elderly & disability care',
    description: `De Drie Hoven was a testimony to creative architectural design in elderly care, designed by famous architect Herman Hertzberger in 1971. The residential complex was intended for the elderly with mild to severe physical and/or mental disabilities. This complex, designed to meet the unique needs and interests of older people, received considerable praise for its emphasis on social interaction and resident autonomy. However, its evolution throughout time reflects the changing environment of elderly care regulations, as well as the problems that come with maintaining such a unique facility.

Comprising four wings surrounding a central building, De Drie Hoven provided a holistic environment for its residents. From double rooms for couples to units equipped with kitchens and bathrooms, the complex accommodated diverse living arrangements. Central to its design was the promotion of social interaction, akin to a small city, where hallways served as indoor streets and shared living spaces facilitated neighbourhood camaraderie.

The heart of the complex lies in its central building, housing communal facilities ranging from kitchens to recreational areas. This central meeting space epitomized a bustling city centre, fostering connections among residents and with the outside world. Architectural elements such as porches and internal facades further encouraged socialization, transforming mere corridors into dynamic thoroughfares.

Central to Hertzberger's ethos was the notion of flexibility, a concept embedded deep within the structure's DNA. The modular design, characterized by prefabricated elements and standardized dimensions, aimed to ensure not only cost efficiency but also the capacity to evolve in tandem with changing needs. De Drie Hoven represents innovation, resilience, and eldercare complexity. It emphasises the necessity to adapt to new requirements while sustaining community living for older individuals.`,
    axos: [
      {
        src: '/images/24/axo-0.jpg',
        caption: '03.2324  Anne Goedhart, Anton Presura, Vanesa Umurska',
        pdfUrl: 'https://drive.google.com/file/d/14WAR-UFQjzslujvPw0rw0LNlCEZC8WGC/view',
      },
    ],
    thumbs: [
      { src: '/images/24/thumb-0.jpg', caption: '01.1  Herman Hertzberger (1964–1970)' },
      { src: '/images/24/thumb-1.jpg', caption: '01.2  Nieuwe Instituut (n.d.)' },
      { src: '/images/24/thumb-2.jpg', caption: '01.3  Nieuwe Instituut (n.d.)' },
      { src: '/images/24/thumb-3.jpg', caption: '02.1  AHH (n.d.)', camPos: { lat: 52.354076, lng: 4.826778, height: 285.4, pitch: -41.7, heading: 310.7 } },
      { src: '/images/24/thumb-4.jpg', caption: '02.2  Hidden Architecture (n.d.)' },
      { src: '/images/24/thumb-5.jpg', caption: '02.3  Nieuwe Instituut (n.d.)' },
    ],
  },
  25: {
    period: '2021–2030',
    programme: 'Co-housing / collective',
    units: '21–50',
    description: `Holacracy is a term used to describe an organizational method that decentralizes management and distributes authority, and is the key to De Warren's success as a housing co-operation. De Warren begins with a collective known as Konijn, the Dutch word for 'Rabbit'. For many years, this group of friends worked together organising different cultural events such as live performance and a music festival located on a permaculture farm in Portugal. Throughout these ventures, Konijn enjoyed the comradery of living, working and experiencing life together. However, returning to normal life always evoked a feeling of sadness and isolation. These emotions inspired a desire to live together as a cooperative, where they could preserve the sense of community. In this moment, the dream of De Warren was born.

In 2016, the 7-year process from the preparation of a substantial plan to the realisation of the building began. From collaboration with Natrufied Architecture in a series of interactive workshops, to the sourcing of materials and interior fabrication; the De Warren group was present and vocal throughout the entire process. The result was a unique building that was carefully and intentionally designed for its residents.

Completed in 2022, De Warren now houses 36 apartments, ranging from a single room of 20m² to a 3-bedroom apartment of 70m², which provides homes to over 50 residents in a community composed of single adults, couples and families. This community shares a variety of communal spaces that are arranged along a central staircase overlooking a large living room with a kitchen and dining area. The other communal spaces include: a children's play area, co-working/making spaces, a meditation room, a music studio and a large multifunction room.`,
    axos: [
      {
        src: '/images/25/axo-0.jpg',
        caption: '03.2324  Julia Wintersteller, Tala Wadeh, Mike Newell',
        pdfUrl: 'https://drive.google.com/file/d/1__9AzJwAeftus4wEF26XZvm5ltXwM3ud/view',
      },
      {
        src: '/images/25/axo-1.jpg',
        caption: '03.2425  Ekin Saribas, Isa van Wezep, Marijn Halbesma, Stefan Vuijst',
        pdfUrl: 'https://drive.google.com/file/d/1JkzIPkhsYqTWIHZFVewzVFFKAbXIh18V/view',
      },
    ],
    thumbs: [
      { src: '/images/25/thumb-0.jpg', caption: '02.1  unknown' },
      { src: '/images/25/thumb-1.jpg', caption: '02.2  unknown' },
      { src: '/images/25/thumb-2.jpg', caption: '02.3  Photograph by Stefan Vuijst (2025)' },
      { src: '/images/25/thumb-3.jpg', caption: '02.4  unknown' },
    ],
  },
  26: {
    period: '1961–1970',
    programme: 'Disability housing',
    units: '101–200',
    description: `In the 1960s, Het Dorp emerged as a pioneering initiative, representing one of the earliest independent housing projects specifically tailored for individuals with disabilities. Its primary aim was to grant individuals with disabilities the opportunity to reside in their own homes while accessing essential care and support services. Initially, this concept garnered widespread acclaim as it epitomized progressive social ideals of the era.

However, as societal perceptions of disability have evolved, the notion of a segregated village exclusively designated for individuals with disabilities has fallen out of favor. Shouldn't quality housing facilitate the full integration of individuals into society? And does that not include acknowledging more than just one part of a person's identity?

At first, Het Dorp gave people with disabilities a feeling of being independent and in control while being supported. They had homes they could easily use, and there were services available to help them live on their own.

Het Dorp had some issues with including everyone in society. By keeping people with disabilities separate, it made them feel left out and different. This made it hard for them to join in with the rest of society. Also, because everything they needed was in the village, they didn't get to meet many people from outside, which meant they didn't have as many chances to make friends outside of their group.

While Het Dorp represented a groundbreaking effort in its time, its approach now appears outdated. Looking ahead, it is imperative to develop contemporary housing models for people with disabilities that prioritize full societal integration, provide for individual needs, and foster inclusivity for all.`,
    axos: [
      {
        src: '/images/26/axo-0.jpg',
        caption: '03.2324  Maud Burcksen, Henrike Beckefeld, Ka Fong Kou',
        pdfUrl: '',
      },
    ],
    thumbs: [
      { src: '/images/26/thumb-0.jpg', caption: '01.1  unknown' },
      { src: '/images/26/thumb-1.jpg', caption: '01.2  Nieuwe Instituut (n.d.)' },
      { src: '/images/26/thumb-2.jpg', caption: '01.3  unknown' },
      { src: '/images/26/thumb-3.jpg', caption: '01.4  unknown' },
      { src: '/images/26/thumb-4.jpg', caption: '01.5  Nieuwe Instituut (n.d.)' },
      { src: '/images/26/thumb-5.jpg', caption: '01.6  Nieuwe Instituut (n.d.)' },
      { src: '/images/26/thumb-6.jpg', caption: '02.1  unknown' },
      { src: '/images/26/thumb-7.jpg', caption: '02.2  unknown' },
    ],
  },
  27: {
    period: '1961–1970',
    programme: 'Student housing',
    units: '> 201',
    description: `The Weesperflat is a student accommodation in central Amsterdam. It was completed in 1966, eight years after Herman Hertzberger and his two colleagues won the competition for a new student house organised by ASVA (the General Student Union of Amsterdam). It is also the first major project of Hertzberger, which inspired him to start his own practice in 1959.

In the original design, the Weesperflat includes twelve units of eighteen for boys, three units of six for girls, and eight apartments for married students. It also features some daring attempts at collective housing. There is a sheltered gallery on the 4th floor in front of the homes for student couples, conceived as a 'street in the sky', where children could play safely and other residents could lounge around. On the lower floors, there are extensive communal facilities — a student restaurant, a café, a bookshop, and a branch of ASVA.

More than 50 years after its completion, the Weesperflat still houses about 250 students. During the years, lots of spontaneous and organised changes have been made to the building. The ground floor public facilities have disappeared, part of it now serves as offices for small businesses, and glass walls have been added to the entrance. The Weesperflat was designated a municipal monument in 2005, recognising its historical values. Nonetheless, as a collective housing, it still retains strong vitality and continues to evolve.`,
    axos: [
      {
        src: '/images/27/axo-0.jpg',
        caption: '03.2324  Frank Ren, Ronald Vink, Youyou Yang, Ziqian Chen',
        pdfUrl: 'https://drive.google.com/file/d/1XLeFBbKaC3Z77w6ED31SJy-xD-r8FqqV/view',
      },
      {
        src: '/images/27/axo-1.jpg',
        caption: '03.2425  Ella Koehorst, Beate Verbeek, Nienke Hofte, Wiktoria Urban',
        pdfUrl: 'https://drive.google.com/file/d/1E3kRiOw_w_L-g0loMV99p4OY61QH4Eqp/view',
      },
    ],
    thumbs: [
      { src: '/images/27/thumb-0.jpg', caption: '01.1  Herman Hertzberger. Nieuwe Instituut, Hertzberger archive (1961)', camPos: { lat: 52.3642, lng: 4.9053, height: 44.5, pitch: -8, heading: 15 } },
      { src: '/images/27/thumb-1.jpg', caption: '01.2  Herman Hertzberger. Nieuwe Instituut, Hertzberger archive (1961)', camPos: { lat: 52.365038, lng: 4.905538, height: 55.3, pitch: 4, heading: 19.1 } },
      { src: '/images/27/thumb-2.jpg', caption: '01.3  Herman Hertzberger. Nieuwe Instituut, Hertzberger archive (1961)' },
      { src: '/images/27/thumb-3.jpg', caption: '01.4  Herman Hertzberger. Nieuwe Instituut, Hertzberger archive (1961)' },
      { src: '/images/27/thumb-4.jpg', caption: '02.1  Photograph by Johan van der Keuken. Nieuwe Instituut, Hertzberger archive (1961)' },
      { src: '/images/27/thumb-5.jpg', caption: '02.2  Photograph by Johan van der Keuken. Nieuwe Instituut, Hertzberger archive (1961)' },
      { src: '/images/27/thumb-6.jpg', caption: '02.3  Photograph by Paul Hartland. Published in Elegance, September 1963. Collectie Stadsarchief Amsterdam: foto\'s' },
    ],
  },
  28: {
    period: '1921–1930',
    programme: 'Psychiatric care pavilion',
    units: '101–200',
    description: `The Pavilion for Restless Women, colloquially known as Pavilion 'Winkler', constituted a segment of the Willem Arntsz Hoeve psychiatric facility. Its construction in 1927, overseen by architect H.F. Mertens, marked an expansion phase. The pavilion was architecturally distinct from the original buildings designed by architect F.W.M. Poggenbeek. While Poggenbeek designed his buildings in the more traditional chalet style, with plastered walls and decorated brick arches above the window frames, Mertens designed his expansion similarly to the more modern 'Amsterdamse Stijl', with reddish-brown brickwork, overhanging roofs, and horizontal window strips (Wagenaar, 2010).

Situated amidst a sprawling woodland expanse in Den Dolder, spanning 207 hectares, the institution comprised pavilions arranged along a central managerial axis, dividing the terrain symmetrically. Male patients were accommodated on the northern side of the axis, whereas female residents inhabited the southern precincts. Additionally, a hierarchical division based on wealth delineated the placement of pavilions, with those of the first class situated nearer to the central axis, while the third-class pavilions were relegated to the periphery. Pavilion Winkler, occupying the outermost position, thereby housed residents categorized as belonging to the lowest socioeconomic stratum within the institution (Wagenaar, 2010).

Treatment modalities at the Willem Arntsz Hoeve primarily emphasized vocational engagement, notably through agricultural and workshop activities, constituting a form of occupational therapy. A workshop facility for indoor tasks was located at the eastern terminus of the central axis. Additionally, male patients were observed undertaking tasks within the boiler room. Notably, however, residents of Pavilion Winkler were reportedly confined within the premises, deprived of access to the surrounding landscape, a circumstance lamented by Anne Bron, manager of real estate at the Willem Arntsz Hoeve.`,
    axos: [
      {
        src: '/images/28/axo-0.jpg',
        caption: '03.2324  Axelle Maassen, Mascha Gerrits, Robin de Wilde',
        pdfUrl: 'https://drive.google.com/file/d/11bzx2DCiYNLxWHnTx1nAhPcarHj2C-SM/view',
      },
    ],
    thumbs: [
      { src: '/images/28/thumb-0.jpg', caption: '01.1  Historical Association Den Dolder (n.d.)' },
      { src: '/images/28/thumb-1.jpg', caption: '01.2  Historical Association Den Dolder (n.d.)' },
      { src: '/images/28/thumb-2.jpg', caption: '02.1  Historical Association Den Dolder (n.d.)' },
      { src: '/images/28/thumb-3.jpg', caption: '02.2  Historical Association Den Dolder (n.d.)' },
      { src: '/images/28/thumb-4.jpg', caption: '02.3  Vergeten Slachtoffers (n.d.)' },
      { src: '/images/28/thumb-5.jpg', caption: '02.4  Historical Association Den Dolder (n.d.)' },
      { src: '/images/28/thumb-6.jpg', caption: '02.5  Open Monumentendag (n.d.)' },
    ],
  },
  29: {
    period: '1981–1990',
    programme: 'Co-housing / collective',
    units: '51–100',
    description: `Centraal Wonen Delft, realised in the neighbourhood Tanthof at the edge of the city Delft in the Netherlands, is one of the first cohousing projects in its country, and has for the last 40 years broadened the ideas of living together. Born from the national Centraal Wonen movement, which emerged in the Netherlands during the 1970s, the project is a pioneering form of co-housing. It aimed to provide alternative forms of living, challenging various social issues, including gender inequality, rising loneliness, and a housing market favouring housing and apartments based on the standard of the nuclear family.

Based on the foundational principle of "doing together what can be done together", the project tries to share as many communal functions as possible. This resulted in four different clusters (red, green, yellow and blue), sharing amenities such as a storage, a laundry space and a garden. These clusters were positioned in the newly designed structure of the neighbourhood as to create both private as common spaces.

These clusters are in turn split into smaller groups, each containing 8–13 people, who share a kitchen, living room and a bathroom. These shared amenities are located on the ground floor, while private units are located both on the ground floor as the floors above. By positioning the shared spaces on the ground floor, people upon entering will always see if these spaces are used, without being forced to move through the spaces.

Although the project itself houses over 100 people, Centraal Wonen found a way to create an intimate and cosy environment by creating different scales of communing. Not only the project itself, but its participatory design process, future proof flexible structure, and strong communal ties makes this project a great example and inspiration for (future) co-housing.`,
    axos: [
      {
        src: '/images/29/axo-0.jpg',
        caption: '03.2324  Tamar Voorhout, Eva Vlasblom',
        pdfUrl: 'https://drive.google.com/file/d/1MtBNaHR8kdrdWOA11PcO9Pl6XHwJqeCz/view',
      },
      {
        src: '/images/29/axo-1.jpg',
        caption: '03.2425  Mathilde Barth, Wong Kai Yan Michelle, Yi Wang, Neema Gohari',
        pdfUrl: 'https://drive.google.com/file/d/15-s8X3COVIuivoIcdmWwbpIrHj0Pf0Wv/view',
      },
    ],
    thumbs: [
      { src: '/images/29/thumb-0.jpg', caption: '01.1  unknown' },
      { src: '/images/29/thumb-1.jpg', caption: '01.2  unknown' },
      { src: '/images/29/thumb-2.jpg', caption: '02.1  Philip Krabbendam' },
      { src: '/images/29/thumb-3.jpg', caption: '02.2  Photograph (1980)' },
      { src: '/images/29/thumb-4.jpg', caption: '02.3  Photograph (1980)' },
      { src: 'https://www.cwdelft.nl/wp-content/uploads/2021/10/foto-281-scaled.jpg', caption: 'https://www.cwdelft.nl/' },
      { src: 'https://www.cwdelft.nl/wp-content/uploads/2021/10/cubabar2.jpg', caption: 'https://www.cwdelft.nl/' },
      { src: 'https://www.cwdelft.nl/wp-content/uploads/2021/10/foto4.jpg', caption: 'https://www.cwdelft.nl/' },
      { src: 'https://www.cwdelft.nl/wp-content/uploads/2021/04/Scan1.jpg', caption: 'https://www.cwdelft.nl/' },
      { src: 'https://www.cwdelft.nl/wp-content/uploads/2021/10/map.png', caption: 'https://www.cwdelft.nl/' },
      { src: 'https://www.cwdelft.nl/wp-content/uploads/2021/10/f659d327c5bf530b2dd04500d070b0a1-770x713-1.jpg', caption: 'https://www.cwdelft.nl/' },
      { src: 'https://www.cwdelft.nl/wp-content/uploads/2021/10/fc35118567dd5cba6035dd06f1f3d8fe-770x499-1.jpg', caption: 'https://www.cwdelft.nl/' },
    ],
  },
  30: {
    description: `Gran Vista is a social housing complex located in Amsterdam’s Waterlooplein, designed by Dik Tuijnman and completed in 1984 as part of the reconstruction of the Nieuwmarkt area following strong civic resistance against large-scale office developments and the metro protests of the 1970s. Rather than replacing the existing urban life, the project integrates housing, commercial spaces, and infrastructure for the local market, embedding itself within the social and spatial fabric of the neighborhood. Its fragmented base and articulated façade establish a porous relationship with the city, while its internal organization combines diverse housing typologies with collective and transitional spaces.

In representing Gran Vista, we understand the building not only as housing, but as an activator and a built manifesto of a specific urban culture shaped by protest, negotiation, and collective agency. Our approach focuses on the building as a relational system that constructs community across different scales: as an urban interface with the market, as a network of collective spaces, as circulation that enables encounter, and as a set of diverse domestic typologies that reflect a heterogeneous society.

This multi-scalar reading is structured as a guided sequence through the building, moving from the city to the domestic. Beginning at the ground level, where Gran Vista operates as an urban stage in direct dialogue with the market, the analysis then unfolds through its collective spaces, circulatory systems, and finally its interior domestic environments. Through this progression, the project reveals how architecture does not simply accommodate life, but actively organizes relationships, mediates boundaries, and produces forms of coexistence that remain open to negotiation and change.`,
    axos: [
      {
        src: '/images/30/axo-0.jpg',
        caption: '03.2526  Cristina García Solís, Laura Vela Villafruela, Yuqi Zhao, Gonzalo de Manuel de Villena',
        pdfUrl: 'https://drive.google.com/file/d/1wAA4MOSIqm0YFbgLIiHNZp82Thx-gzca/view',
      },
    ],
    thumbs: [
      { src: '/images/30/thumb-0.jpg', caption: '01.1  Floor plan: Unit distribution and gallery access, unknown' },
      { src: '/images/30/thumb-1.jpg', caption: '02.1  Exterior view upon completion, foto Dienst Ruimtelijke Ordening (1994)' },
      { src: '/images/30/thumb-2.jpg', caption: '02.2  Exterior view upon completion, foto Dienst Ruimtelijke Ordening (1994)' },
    ],
  },
  31: {
    description: `The Pentagon is a social housing complex in Amsterdam’s Nieuwmarkt area, designed by architect Theo Bosch and Aldo van Eyck as part of the neighbourhood’s reconstruction after the metro protests completed in 1983. Its distinctive five-sided form encloses an inner courtyeard, combining high-density housing with human-scale urban design that fits thte historic city center.

In representing the Pentagon housing project, we will focus on the diversity of its residential community and the typological variety of flats within the complex. Particular attention will be given to threshold spaces as key elements that mediate between private and collective life.`,
    axos: [
      {
        src: '/images/31/axo-0.jpg',
        caption: '03.2526  Erika Boguckaite, Jingling Ding, Laura Mauro',
        pdfUrl: '',
      },
    ],
    thumbs: [
      { src: '/images/31/thumb-0.jpg', caption: '01.1  Zoning map of the Nieuwmarkt Reconstruction Plan, 1953. Albers, A. (2021)' },
      { src: '/images/31/thumb-1.jpg', caption: '01.2  Urban planning plan for the Reconstruction area Nieuwmarkt neighbourhood, third Neighbourhood meeting on Oct 9, 1980. Albers, A. (2021)' },
      { src: '/images/31/thumb-2.jpg', caption: '01.3  Cross sections of the Pentagon, Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/31/thumb-3.jpg', caption: '01.4  A fragment of the ground floor of the Pentagon showing commercial spaces. Collection BOSC0035, Inventory BOSC 123.1, Stadsarchief Rotterdam (n.d.)' },
      { src: '/images/31/thumb-4.jpg', caption: '02.1  Aerial view Nieuwmarkt in 1984, Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/31/thumb-5.jpg', caption: '02.2  Pentagon Construction Phase, Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/31/thumb-6.jpg', caption: '02.3  Sint Antoniesbreestraat Cafe, Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/31/thumb-7.jpg', caption: '02.4  Pentagon Courtyard. Stadsarchief Amsterdam (n.d.)' },
    ],
  },
  32: {
    description: `Bickerseiland is an urban infill project inserted within the existing fabric of Amsterdam’s Western Islands. Following community resistance and protest against commercial development that risked demolition of existing neighbourhoods, architects Paul de Ley and Jouke van den Bout collaborated with the local community to design social housing that aligned with its history, scale, and strong collective nature. Our research centres on this fundamental relationship between architecture and solidarity. This was foundational to our approach in examining Bickerseiland’s urban relationship to the neighbourhood and wider Amsterdam. Prioritisation in designing cohesively to surrounding neighbourhood scale and facade expresses a principal consideration of the site’s heritage. Through the lens of Henri Lefebvre’s The Right to the City (1968), we examined the way grassroots action defended both the neighbourhood’s community and architectural character. This revealed the inextricable relationship between physical urban spaces and the socio-political right for individuals to have belonging in these spaces (Lefebvre, 1968/1996). The characteristic bay windows, providing abundant light and outlook can be interpreted as a key representation of inclusivity and egalitarian belonging in the city. The community-led design process was fundamental in the development’s classification as Experimental Housing (Cultural Heritage Agency, n.d.), a movement supported by the Dutch housing ministry to challenge mass standardised developments (Van de Heuvel, 2021). The close collaboration between the neighbourhood and the architects further recognises the significance of community engagement for designers to holistically understand key neighbourhood needs. Emphasising the significance of social housing and its relationship to the city, our research further encompasses the surrounding community-run amenities, such as the publically accessible garden. The cruciality of moments of collective living that defined the social character and solidarity of Bickerseiland. Ultimately, Bickerseiland, through the diverse but interconnected lens of The Right to the City, Solidarity, Experimental Housing and Appropriation of public spaces has shaped it as an enduring place prioritising social activity, creativity and community.`,
    thumbs: [
      { src: '/images/32/thumb-0.jpg', caption: '01.1  Drawing of building facades in elevation, 1974, Paul de Ley Archive, Het Nieuwe Instituut' },
      { src: '/images/32/thumb-1.jpg', caption: '01.2  unknown' },
      { src: '/images/32/thumb-2.jpg', caption: '01.3  Sketch by Jouke van den Bout, 1977, Stadsarchief Amsterdam' },
      { src: '/images/32/thumb-3.jpg', caption: '02.1  Photos of building model, Paul de Ley Archive, Het Nieuwe Instituut (n.d.)' },
    ],
  },
  33: {
    description: `The Realengracht is a social housing project located on the Realeneiland, part of the Westelijke Eilanden in the heart of Amsterdam, consisting of 64 housing units arranged across two buildings: facing onto canal and street respectively with colourful facades and a shared courtyard connecting them.

The housing is characterized by its large variation of dwelling types that brings together a diverse group of inhabitants. Small galleries each provide access to four apartments, an intimate arrangement that encourages neighbourliness.

The rounded balconies, present in every unit, are used to the fullest by residents, and together with the galleries have become a theatre of everyday life, where differences in age, background, nationality and lifestyle are quietly put on display.

Since its completion, the building has served as a place where residents can feel at home and at peace; a retreat from the busy city.

This research was developed with archival material from the Nieuwe Instituut and Amsterdam City, and through an interview with Inez Liem, wife of the late Lucien Lafour and also a contributor to this project.`,
    axos: [
      {
        src: '/images/33/axo-0.jpg',
        caption: '03.2526  Federica Bonato, Jules Denéchère, Anna Durand-Hilfiker, David Veen',
        pdfUrl: 'https://drive.google.com/file/d/1eVgPe3wlovl4sOtsTKvL8CgTMrwqLnDs/view',
      },
    ],
    thumbs: [
      { src: '/images/33/thumb-0.jpg', caption: '01.1  Floor plan, Lucien Lafour, Nieuwe Instituut Rotterdam (n.d.)' },
      { src: '/images/33/thumb-1.jpg', caption: '01.2  Facade drawing, , Lucien Lafour, Nieuwe Instituut Rotterdam (n.d.)' },
      { src: '/images/33/thumb-2.jpg', caption: '02.1  View from the bridge, Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/33/thumb-3.jpg', caption: '02.2  View in the courtyard, Nieuwe Instituut Rotterdam (n.d.)' },
    ],
  },
  34: {
    description: `The Binnengasthuisterrein in Amsterdam reflects centuries of social care, urban change, and architectural thinking. from its origins as medieval nunneries to its long role as the city’s central hospital, the area has consistently served diverse and often vulnerable communities, embedding care and collective life into its spatial identity.

The relocation of the hospital in 1981 marked a turning point, opening the site to redevelopment during a period of intense urban transformation. At the same time, strong public resistance emerged against large scale, top down planning strategies that threatened existing neighborhoods. In response, architects such as Paul De Ley, working with Aldo van Eyck and Theo Bosch, developed participatory design approaches that actively involved residents and prioritized their needs.

Historical layers, social values, and community driven planning ultimately shaped the redevelopment of the Binnengasthuisterrein into a mixed social housing environment. Through archival materials including drawings, models, and documents, the project reveals how architecture can respond to questions of inclusion, urban renewal, and collective living, while negotiating the relationship between past and present.`,
    axos: [
      {
        src: '/images/34/axo-0.jpg',
        caption: '03.2526  Giorgio Crescenti, Janice Blondeel, Defne Akman, Eszter Bérces',
        pdfUrl: 'https://drive.google.com/file/d/1U9BQ1qWT_AP1solOwBDHNmv4F78Mt1qo/view',
      },
    ],
    thumbs: [
      { src: '/images/34/thumb-0.jpg', caption: '01.1  Copper engraving of Binnengasthuis by Casparus Commelin (1693), Dat Narrenschip, 2026' },
      { src: '/images/34/thumb-1.jpg', caption: '01.2  Ground floor plan of the Binnengasthuisterrein by Paul De Ley, Archiwijzer, 2026' },
      { src: '/images/34/thumb-2.jpg', caption: '01.3  Different apartments, Archiwijzer | BONAS Foundation, 2026' },
      { src: '/images/34/thumb-3.jpg', caption: '01.4  Axonometric of the Binnengasthuisterrein, Nieuwe Instituut Archives (n.d.)' },
      { src: '/images/34/thumb-4.jpg', caption: '02.1  Photograph of the Binnengasthuisterrein, Amsterdam City Archive (n.d.)' },
      { src: '/images/34/thumb-5.jpg', caption: '02.2  Photograph of the Binnengasthuisterrein, Nieuwe Instituut Archives (n.d.)' },
      { src: '/images/34/thumb-6.jpg', caption: '02.3  Photograph of the Binnengasthuisterrein, Amsterdam City Archive (n.d.)' },
      { src: '/images/34/thumb-7.jpg', caption: '02.4  Aeriel photograph of the Binnengasthuisterrein and surroundings, Amsterdam City Archives (n.d.)' },
    ],
  },
  35: {
    description: `The Spanish Quay is one of four projects within the larger redevelopment of Rotterdam’s Old Harbour, alongside the Potloodgebouw, Cube Houses and Zuidflat, all designed by Piet Blom. The project consists largely of social housing and is deliberately positioned along the waterfront, making harbour views accessible to lower-income residents.

While Blom’s earlier concept of the “urban roof” could not be directly applied due to the required high housing density, the Spanish Quay reflects the same social ambition. The housing is placed on an elevated platform that forms a collective ground, with small squares and pedestrian routes intended to stimulate encounter and everyday interaction. Together with cafés and small businesses along the quay, the project creates a village-like environment within the city, reminiscent of a small Mediterranean harbour town.

The development accommodates a wide variety of dwelling types, yet larger units are not more luxurious but simply contain more rooms. In this way, Blom’s strongly anti-elitist vision becomes spatially visible, expressing his search for a more classless form of urban living.`,
    axos: [
      {
        src: '/images/35/axo-0.jpg',
        caption: '03.2526  Thijmen van den Herik, Loïc Van den Spiegel, Sayan Chowdhury, Louise Meeuwissen',
        pdfUrl: 'https://drive.google.com/file/d/18_4m8qhVcz1zjkqCazh9XR8-efFRLoGW/view',
      },
    ],
    thumbs: [
      { src: '/images/35/thumb-0.jpg', caption: '01.1  Selected excerpts from the presentation pamphlet of the first phase of the Old Harbour redevelopment (july 1978), depicting building B and C of the Spanish Quay, Het Nieuwe Instituut, archive reference BLOM234' },
      { src: '/images/35/thumb-1.jpg', caption: '01.2  Spaanse Kade comprised of 4 building blocks: building section A1 (max. 6 storeys), building section A2 (max. 11 storeys), building section B (max. 9 storeys), and building section C (max. 10 storeys), Het Nieuwe Instituut, archive reference BLOM.110324358' },
      { src: '/images/35/thumb-2.jpg', caption: '01.3  Elevation Drawings of Spaanse Kade Block A2, depicting stepped massing, Het Nieuwe Instituut, archive reference BLOM169' },
      { src: '/images/35/thumb-3.jpg', caption: '02.1  Spaanse Kade under construction, 1983, city archive Rotterdam, photograph by Jacques Zorgman' },
      { src: '/images/35/thumb-4.jpg', caption: '02.2  Maquette design collective squares. P. Blom, Oude Haven, Blaak overbouwing and Spaanse Kade, Rotterdam, 1977-1978, Het Nieuwe Instituut, BLOOM f230' },
    ],
  },
  36: {
    description: `Palmdwarsstraat, in the Amsterdam neighbourhood Jordaan sits at the intersection of class, domesticity, and collective urban life, a place where the boundaries between public and private, street and home, become fluid “in-between” spaces. These thresholds shape how people live together, care for one another, and enact their right to the city. As the original vision of social housing for young families shifts toward an aging population, the architecture becomes a living record of changing needs and behaviours. In this context, the architect emerges not just as a designer, but as an advocate for social justice. Historically architecture is woven with designers forming opinions on the needs and desires of others. Palmdwarsstraat used a bottom up approach, allowing the community to help inform the design. Designed in the 1970s by Theo Bosch and Aldo van Eyck emerged from the post-65 urban renewal movement. The clustered scheme of 50 social housing units and 21 commercial spaces aimed to support Jordaan families and businesses. Palmdwarsstraat can be understood as a village within a city: a dense yet intimate environment where neighbourly connection is formed through shared space. Through this lens, architects use design as a tool for creating socially equitable, caring and compassionate urban communities.`,
    axos: [
      {
        src: '/images/36/axo-0.jpg',
        caption: '03.2526  Alice Wensing, Heba Smári, Lucy Olson',
        pdfUrl: '',
      },
    ],
    thumbs: [
      { src: '/images/36/thumb-0.jpg', caption: '01.1  Original drawing by Theo Bosch and Aldo van Eyck, unknown' },
      { src: '/images/36/thumb-1.jpg', caption: '02.1  Palmdwarsstraat 1920, Het Nieuwe Instituut' },
      { src: '/images/36/thumb-2.jpg', caption: '02.2  Palmdwarsstraat, 1981, unknown' },
    ],
  },
  37: {
    period: '1971–1980',
    programme: 'Structuralist co-housing',
    units: '> 201',
    description: `Groenhoven is a good example of a successful collective housing project. Its development began as part of the urban development of Amsterdam’s Bijlmer, based on modernist principles inspired by Le Corbusier. While the project was initially built to attract middle-class families, architect Van Stigt also sought to create a strong sense of community.

Although the Bijlmer later gained a negative reputation as a scattered and sometimes unsafe neighbourhood, Groenhoven residents have actively challenged this stigma by creating a safe and strongly communal environment. While the Bijlmer follows a predominantly horizontal honeycomb layout , Groenhoven responds to the outcomes of that model with a more ver tical design strategy combined with horizontal community spaces. Through this ver ticality the architect wanted to remove anonymity and cr eate c ollectivity.

And while Groenhoven does a good job of integrating this collectivity, it also raises the question of intersectionality among class, age and nationalities. While Groenhoven represents the potential of collective housing, it simultaneously challenges us to question for whom this sense of community is truly accessible.`,
    axos: [
      {
        src: '/images/37/axo-0.jpg',
        caption: '03.2526  Jitske Huisman, Sanne Krijnen, Zamir Narvaez, Ella Chi',
        pdfUrl: 'https://drive.google.com/file/d/1QxTc8vhMiV92PDVbRyPrAfyAAMwNU8QB/view',
      },
    ],
    thumbs: [
      { src: '/images/37/thumb-0.jpg', caption: '01.1  Nieuwe Instituut (n.d.)' },
      { src: '/images/37/thumb-1.jpg', caption: '01.2  Nieuwe Instituut (n.d.)' },
      { src: '/images/37/thumb-2.jpg', caption: '01.3  Amsterdam Beeldbank Archive (n.d.)' },
      { src: '/images/37/thumb-3.jpg', caption: '01.4  Amsterdam Beeldbank Archive (n.d.)' },
      { src: '/images/37/thumb-4.jpg', caption: '01.5  Amsterdam Beeldbank Archive (n.d.)' },
      { src: '/images/37/thumb-5.jpg', caption: '01.6  STIG7.9 High-rise. Studies/proposals for apartment floor plans. Isometric view. 1970-1971' },
      { src: '/images/37/thumb-6.jpg', caption: '01.7  STIG7.2 High-rise buildings. Sketches. Apartment floor plans, sections, facades, site plans, sun exposure studies. Roll 2 , 1970-1973' },
      { src: '/images/37/thumb-7.jpg', caption: '01.8  STIG7.13 High-rise. Pedestrian street perspectives. Design drawings/presentation drawings.' },
      { src: '/images/37/thumb-8.jpg', caption: '01.9  STIG7.13 High-rise. Pedestrian street perspectives. Design drawings/presentation drawings.' },
      { src: '/images/37/thumb-9.jpg', caption: '01.10  STIG7.12 High-rise buildings. Sites and axonometry. Design drawings/presentation drawings.' },
      { src: '/images/37/thumb-10.jpg', caption: '01.11  STIG7.12 High-rise buildings. Sites and axonometry. Design drawings/presentation drawings.' },
      { src: '/images/37/thumb-11.jpg', caption: '02.1  Amsterdam Beeldbank Archive (n.d.)', camPos: { lat: 52.328257, lng: 4.975334, height: 362.8, pitch: -45.1, heading: 191.8 } },
      { src: '/images/37/thumb-12.jpg', caption: '02.2  Amsterdam Beeldbank Archive (n.d.)', camPos: { lat: 52.331548, lng: 4.9956, height: 530.5, pitch: -18.9, heading: 248.4 } },
      { src: '/images/37/thumb-13.jpg', caption: '02.3  unknown' },
      { src: '/images/37/thumb-14.jpg', caption: '02.4  Nieuwe Instituut (n.d.)' },
      { src: '/images/37/thumb-15.jpg', caption: '02.5  unknown' },
    ],
  },
  38: {
    description: `On a summer day in 1954, Aldo van Eyck returned home to find a stranger waiting for him. The man was Frans van Meurs, former alderman of the City of Amsterdam and, at the time, director of the Old Orphanage in Sint-Luciensteeg. Van Meurs had a mission that had been years in the making.

Before the war, van Meurs had already begun imagining a different kind of home for his orphans- one that would draw them out of the congestion of the inner city and into a new, modern building set within open, verdant surroundings. He had already identified the site before the war, but he still needed an architect. His search had led him to van Eyck- then not yet a prominent figure in Dutch architecture, but someone who had caught van Meurs’ attention through an alternative body of work: the small children’s playgrounds that had been steadily appearing across Amsterdam’s neighborhoods.

It was precisely this sensibility that made van Eyck compelling to van Meurs. After years of running the Old Orphanage, he had developed clear and deeply held convictions about what the new building should be, not merely in its organization, but in its very character. He wanted to draw his children away from the noise and busyness of the city, into what he envisioned as a small, ideal world: bathed in fresh air, sunlight, and greenery, and rich with opportunities for play, sport, music, craft, and all manner of creative expression.

Above all, van Meurs understood that the children who would live there were children without a home- separated from their parents for months, sometimes years at a time. The building, in his view, had to answer to that absence. It would not be an institutional oppsive building, but a home for a large family.`,
    axos: [
      {
        src: '/images/38/axo-0.jpg',
        caption: '03.2526  Jort Hersbach, Mei Li, Zoë Luijten, Anuja Thurairajah',
        pdfUrl: 'https://drive.google.com/file/d/1menO1iplQMkCULtJg12lkcbdQqqszm2R/view',
      },
    ],
    thumbs: [
      { src: '/images/38/thumb-0.jpg', caption: '01.1  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-1.jpg', caption: '01.2  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-2.jpg', caption: '01.3  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-3.jpg', caption: '01.4  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-4.jpg', caption: '01.5  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-5.jpg', caption: '02.1  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-6.jpg', caption: '02.2  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-7.jpg', caption: '02.3  Stadsarchief Amsterdam (n.d.)' },
      { src: '/images/38/thumb-8.jpg', caption: '02.4  Stadsarchief Amsterdam (n.d.)' },
    ],
  },
};
