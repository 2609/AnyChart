var chart;
anychart.onDocumentLoad(function() {
  var data = [
    [0, 0],
    [1, 0.017452406],
    [2, 0.034899497],
    [3, 0.052335956],
    [4, 0.069756474],
    [5, 0.087155743],
    [6, 0.104528463],
    [7, 0.121869343],
    [8, 0.139173101],
    [9, 0.156434465],
    [10, 0.173648178],
    [11, 0.190808995],
    [12, 0.207911691],
    [13, 0.224951054],
    [14, 0.241921896],
    [15, 0.258819045],
    [16, 0.275637356],
    [17, 0.292371705],
    [18, 0.309016994],
    [19, 0.325568154],
    [20, 0.342020143],
    [21, 0.35836795],
    [22, 0.374606593],
    [23, 0.390731128],
    [24, 0.406736643],
    [25, 0.422618262],
    [26, 0.438371147],
    [27, 0.4539905],
    [28, 0.469471563],
    [29, 0.48480962],
    [30, 0.5],
    [31, 0.515038075],
    [32, 0.529919264],
    [33, 0.544639035],
    [34, 0.559192903],
    [35, 0.573576436],
    [36, 0.587785252],
    [37, 0.601815023],
    [38, 0.615661475],
    [39, 0.629320391],
    [40, 0.64278761],
    [41, 0.656059029],
    [42, 0.669130606],
    [43, 0.68199836],
    [44, 0.69465837],
    [45, 0.707106781],
    [46, 0.7193398],
    [47, 0.731353702],
    [48, 0.743144825],
    [49, 0.75470958],
    [50, 0.766044443],
    [51, 0.777145961],
    [52, 0.788010754],
    [53, 0.79863551],
    [54, 0.809016994],
    [55, 0.819152044],
    [56, 0.829037573],
    [57, 0.838670568],
    [58, 0.848048096],
    [59, 0.857167301],
    [60, 0.866025404],
    [61, 0.874619707],
    [62, 0.882947593],
    [63, 0.891006524],
    [64, 0.898794046],
    [65, 0.906307787],
    [66, 0.913545458],
    [67, 0.920504853],
    [68, 0.927183855],
    [69, 0.933580426],
    [70, 0.939692621],
    [71, 0.945518576],
    [72, 0.951056516],
    [73, 0.956304756],
    [74, 0.961261696],
    [75, 0.965925826],
    [76, 0.970295726],
    [77, 0.974370065],
    [78, 0.978147601],
    [79, 0.981627183],
    [80, 0.984807753],
    [81, 0.987688341],
    [82, 0.990268069],
    [83, 0.992546152],
    [84, 0.994521895],
    [85, 0.996194698],
    [86, 0.99756405],
    [87, 0.998629535],
    [88, 0.999390827],
    [89, 0.999847695],
    [90, 1],
    [91, 0.999847695],
    [92, 0.999390827],
    [93, 0.998629535],
    [94, 0.99756405],
    [95, 0.996194698],
    [96, 0.994521895],
    [97, 0.992546152],
    [98, 0.990268069],
    [99, 0.987688341],
    [100, 0.984807753],
    [101, 0.981627183],
    [102, 0.978147601],
    [103, 0.974370065],
    [104, 0.970295726],
    [105, 0.965925826],
    [106, 0.961261696],
    [107, 0.956304756],
    [108, 0.951056516],
    [109, 0.945518576],
    [110, 0.939692621],
    [111, 0.933580426],
    [112, 0.927183855],
    [113, 0.920504853],
    [114, 0.913545458],
    [115, 0.906307787],
    [116, 0.898794046],
    [117, 0.891006524],
    [118, 0.882947593],
    [119, 0.874619707],
    [120, 0.866025404],
    [121, 0.857167301],
    [122, 0.848048096],
    [123, 0.838670568],
    [124, 0.829037573],
    [125, 0.819152044],
    [126, 0.809016994],
    [127, 0.79863551],
    [128, 0.788010754],
    [129, 0.777145961],
    [130, 0.766044443],
    [131, 0.75470958],
    [132, 0.743144825],
    [133, 0.731353702],
    [134, 0.7193398],
    [135, 0.707106781],
    [136, 0.69465837],
    [137, 0.68199836],
    [138, 0.669130606],
    [139, 0.656059029],
    [140, 0.64278761],
    [141, 0.629320391],
    [142, 0.615661475],
    [143, 0.601815023],
    [144, 0.587785252],
    [145, 0.573576436],
    [146, 0.559192903],
    [147, 0.544639035],
    [148, 0.529919264],
    [149, 0.515038075],
    [150, 0.5],
    [151, 0.48480962],
    [152, 0.469471563],
    [153, 0.4539905],
    [154, 0.438371147],
    [155, 0.422618262],
    [156, 0.406736643],
    [157, 0.390731128],
    [158, 0.374606593],
    [159, 0.35836795],
    [160, 0.342020143],
    [161, 0.325568154],
    [162, 0.309016994],
    [163, 0.292371705],
    [164, 0.275637356],
    [165, 0.258819045],
    [166, 0.241921896],
    [167, 0.224951054],
    [168, 0.207911691],
    [169, 0.190808995],
    [170, 0.173648178],
    [171, 0.156434465],
    [172, 0.139173101],
    [173, 0.121869343],
    [174, 0.104528463],
    [175, 0.087155743],
    [176, 0.069756474],
    [177, 0.052335956],
    [178, 0.034899497],
    [179, 0.017452406],
    [180, 1.22515E-16],
    [181, -0.017452406],
    [182, -0.034899497],
    [183, -0.052335956],
    [184, -0.069756474],
    [185, -0.087155743],
    [186, -0.104528463],
    [187, -0.121869343],
    [188, -0.139173101],
    [189, -0.156434465],
    [190, -0.173648178],
    [191, -0.190808995],
    [192, -0.207911691],
    [193, -0.224951054],
    [194, -0.241921896],
    [195, -0.258819045],
    [196, -0.275637356],
    [197, -0.292371705],
    [198, -0.309016994],
    [199, -0.325568154],
    [200, -0.342020143],
    [201, -0.35836795],
    [202, -0.374606593],
    [203, -0.390731128],
    [204, -0.406736643],
    [205, -0.422618262],
    [206, -0.438371147],
    [207, -0.4539905],
    [208, -0.469471563],
    [209, -0.48480962],
    [210, -0.5],
    [211, -0.515038075],
    [212, -0.529919264],
    [213, -0.544639035],
    [214, -0.559192903],
    [215, -0.573576436],
    [216, -0.587785252],
    [217, -0.601815023],
    [218, -0.615661475],
    [219, -0.629320391],
    [220, -0.64278761],
    [221, -0.656059029],
    [222, -0.669130606],
    [223, -0.68199836],
    [224, -0.69465837],
    [225, -0.707106781],
    [226, -0.7193398],
    [227, -0.731353702],
    [228, -0.743144825],
    [229, -0.75470958],
    [230, -0.766044443],
    [231, -0.777145961],
    [232, -0.788010754],
    [233, -0.79863551],
    [234, -0.809016994],
    [235, -0.819152044],
    [236, -0.829037573],
    [237, -0.838670568],
    [238, -0.848048096],
    [239, -0.857167301],
    [240, -0.866025404],
    [241, -0.874619707],
    [242, -0.882947593],
    [243, -0.891006524],
    [244, -0.898794046],
    [245, -0.906307787],
    [246, -0.913545458],
    [247, -0.920504853],
    [248, -0.927183855],
    [249, -0.933580426],
    [250, -0.939692621],
    [251, -0.945518576],
    [252, -0.951056516],
    [253, -0.956304756],
    [254, -0.961261696],
    [255, -0.965925826],
    [256, -0.970295726],
    [257, -0.974370065],
    [258, -0.978147601],
    [259, -0.981627183],
    [260, -0.984807753],
    [261, -0.987688341],
    [262, -0.990268069],
    [263, -0.992546152],
    [264, -0.994521895],
    [265, -0.996194698],
    [266, -0.99756405],
    [267, -0.998629535],
    [268, -0.999390827],
    [269, -0.999847695],
    [270, -1],
    [271, -0.999847695],
    [272, -0.999390827],
    [273, -0.998629535],
    [274, -0.99756405],
    [275, -0.996194698],
    [276, -0.994521895],
    [277, -0.992546152],
    [278, -0.990268069],
    [279, -0.987688341],
    [280, -0.984807753],
    [281, -0.981627183],
    [282, -0.978147601],
    [283, -0.974370065],
    [284, -0.970295726],
    [285, -0.965925826],
    [286, -0.961261696],
    [287, -0.956304756],
    [288, -0.951056516],
    [289, -0.945518576],
    [290, -0.939692621],
    [291, -0.933580426],
    [292, -0.927183855],
    [293, -0.920504853],
    [294, -0.913545458],
    [295, -0.906307787],
    [296, -0.898794046],
    [297, -0.891006524],
    [298, -0.882947593],
    [299, -0.874619707],
    [300, -0.866025404],
    [301, -0.857167301],
    [302, -0.848048096],
    [303, -0.838670568],
    [304, -0.829037573],
    [305, -0.819152044],
    [306, -0.809016994],
    [307, -0.79863551],
    [308, -0.788010754],
    [309, -0.777145961],
    [310, -0.766044443],
    [311, -0.75470958],
    [312, -0.743144825],
    [313, -0.731353702],
    [314, -0.7193398],
    [315, -0.707106781],
    [316, -0.69465837],
    [317, -0.68199836],
    [318, -0.669130606],
    [319, -0.656059029],
    [320, -0.64278761],
    [321, -0.629320391],
    [322, -0.615661475],
    [323, -0.601815023],
    [324, -0.587785252],
    [325, -0.573576436],
    [326, -0.559192903],
    [327, -0.544639035],
    [328, -0.529919264],
    [329, -0.515038075],
    [330, -0.5],
    [331, -0.48480962],
    [332, -0.469471563],
    [333, -0.4539905],
    [334, -0.438371147],
    [335, -0.422618262],
    [336, -0.406736643],
    [337, -0.390731128],
    [338, -0.374606593],
    [339, -0.35836795],
    [340, -0.342020143],
    [341, -0.325568154],
    [342, -0.309016994],
    [343, -0.292371705],
    [344, -0.275637356],
    [345, -0.258819045],
    [346, -0.241921896],
    [347, -0.224951054],
    [348, -0.207911691],
    [349, -0.190808995],
    [350, -0.173648178],
    [351, -0.156434465],
    [352, -0.139173101],
    [353, -0.121869343],
    [354, -0.104528463],
    [355, -0.087155743],
    [356, -0.069756474],
    [357, -0.052335956],
    [358, -0.034899497],
    [359, -0.017452406],
    [360, -2.4503E-16]
  ];

  var data2 = [
    [1, 0.999847695],
    [2, 0.999390827],
    [3, 0.998629535],
    [4, 0.99756405],
    [5, 0.996194698],
    [6, 0.994521895],
    [7, 0.992546152],
    [8, 0.990268069],
    [9, 0.987688341],
    [10, 0.984807753],
    [11, 0.981627183],
    [12, 0.978147601],
    [13, 0.974370065],
    [14, 0.970295726],
    [15, 0.965925826],
    [16, 0.961261696],
    [17, 0.956304756],
    [18, 0.951056516],
    [19, 0.945518576],
    [20, 0.939692621],
    [21, 0.933580426],
    [22, 0.927183855],
    [23, 0.920504853],
    [24, 0.913545458],
    [25, 0.906307787],
    [26, 0.898794046],
    [27, 0.891006524],
    [28, 0.882947593],
    [29, 0.874619707],
    [30, 0.866025404],
    [31, 0.857167301],
    [32, 0.848048096],
    [33, 0.838670568],
    [34, 0.829037573],
    [35, 0.819152044],
    [36, 0.809016994],
    [37, 0.79863551],
    [38, 0.788010754],
    [39, 0.777145961],
    [40, 0.766044443],
    [41, 0.75470958],
    [42, 0.743144825],
    [43, 0.731353702],
    [44, 0.7193398],
    [45, 0.707106781],
    [46, 0.69465837],
    [47, 0.68199836],
    [48, 0.669130606],
    [49, 0.656059029],
    [50, 0.64278761],
    [51, 0.629320391],
    [52, 0.615661475],
    [53, 0.601815023],
    [54, 0.587785252],
    [55, 0.573576436],
    [56, 0.559192903],
    [57, 0.544639035],
    [58, 0.529919264],
    [59, 0.515038075],
    [60, 0.5],
    [61, 0.48480962],
    [62, 0.469471563],
    [63, 0.4539905],
    [64, 0.438371147],
    [65, 0.422618262],
    [66, 0.406736643],
    [67, 0.390731128],
    [68, 0.374606593],
    [69, 0.35836795],
    [70, 0.342020143],
    [71, 0.325568154],
    [72, 0.309016994],
    [73, 0.292371705],
    [74, 0.275637356],
    [75, 0.258819045],
    [76, 0.241921896],
    [77, 0.224951054],
    [78, 0.207911691],
    [79, 0.190808995],
    [80, 0.173648178],
    [81, 0.156434465],
    [82, 0.139173101],
    [83, 0.121869343],
    [84, 0.104528463],
    [85, 0.087155743],
    [86, 0.069756474],
    [87, 0.052335956],
    [88, 0.034899497],
    [89, 0.017452406],
    [90, 6.12574E-17],
    [91, -0.017452406],
    [92, -0.034899497],
    [93, -0.052335956],
    [94, -0.069756474],
    [95, -0.087155743],
    [96, -0.104528463],
    [97, -0.121869343],
    [98, -0.139173101],
    [99, -0.156434465],
    [100, -0.173648178],
    [101, -0.190808995],
    [102, -0.207911691],
    [103, -0.224951054],
    [104, -0.241921896],
    [105, -0.258819045],
    [106, -0.275637356],
    [107, -0.292371705],
    [108, -0.309016994],
    [109, -0.325568154],
    [110, -0.342020143],
    [111, -0.35836795],
    [112, -0.374606593],
    [113, -0.390731128],
    [114, -0.406736643],
    [115, -0.422618262],
    [116, -0.438371147],
    [117, -0.4539905],
    [118, -0.469471563],
    [119, -0.48480962],
    [120, -0.5],
    [121, -0.515038075],
    [122, -0.529919264],
    [123, -0.544639035],
    [124, -0.559192903],
    [125, -0.573576436],
    [126, -0.587785252],
    [127, -0.601815023],
    [128, -0.615661475],
    [129, -0.629320391],
    [130, -0.64278761],
    [131, -0.656059029],
    [132, -0.669130606],
    [133, -0.68199836],
    [134, -0.69465837],
    [135, -0.707106781],
    [136, -0.7193398],
    [137, -0.731353702],
    [138, -0.743144825],
    [139, -0.75470958],
    [140, -0.766044443],
    [141, -0.777145961],
    [142, -0.788010754],
    [143, -0.79863551],
    [144, -0.809016994],
    [145, -0.819152044],
    [146, -0.829037573],
    [147, -0.838670568],
    [148, -0.848048096],
    [149, -0.857167301],
    [150, -0.866025404],
    [151, -0.874619707],
    [152, -0.882947593],
    [153, -0.891006524],
    [154, -0.898794046],
    [155, -0.906307787],
    [156, -0.913545458],
    [157, -0.920504853],
    [158, -0.927183855],
    [159, -0.933580426],
    [160, -0.939692621],
    [161, -0.945518576],
    [162, -0.951056516],
    [163, -0.956304756],
    [164, -0.961261696],
    [165, -0.965925826],
    [166, -0.970295726],
    [167, -0.974370065],
    [168, -0.978147601],
    [169, -0.981627183],
    [170, -0.984807753],
    [171, -0.987688341],
    [172, -0.990268069],
    [173, -0.992546152],
    [174, -0.994521895],
    [175, -0.996194698],
    [176, -0.99756405],
    [177, -0.998629535],
    [178, -0.999390827],
    [179, -0.999847695],
    [180, -1],
    [181, -0.999847695],
    [182, -0.999390827],
    [183, -0.998629535],
    [184, -0.99756405],
    [185, -0.996194698],
    [186, -0.994521895],
    [187, -0.992546152],
    [188, -0.990268069],
    [189, -0.987688341],
    [190, -0.984807753],
    [191, -0.981627183],
    [192, -0.978147601],
    [193, -0.974370065],
    [194, -0.970295726],
    [195, -0.965925826],
    [196, -0.961261696],
    [197, -0.956304756],
    [198, -0.951056516],
    [199, -0.945518576],
    [200, -0.939692621],
    [201, -0.933580426],
    [202, -0.927183855],
    [203, -0.920504853],
    [204, -0.913545458],
    [205, -0.906307787],
    [206, -0.898794046],
    [207, -0.891006524],
    [208, -0.882947593],
    [209, -0.874619707],
    [210, -0.866025404],
    [211, -0.857167301],
    [212, -0.848048096],
    [213, -0.838670568],
    [214, -0.829037573],
    [215, -0.819152044],
    [216, -0.809016994],
    [217, -0.79863551],
    [218, -0.788010754],
    [219, -0.777145961],
    [220, -0.766044443],
    [221, -0.75470958],
    [222, -0.743144825],
    [223, -0.731353702],
    [224, -0.7193398],
    [225, -0.707106781],
    [226, -0.69465837],
    [227, -0.68199836],
    [228, -0.669130606],
    [229, -0.656059029],
    [230, -0.64278761],
    [231, -0.629320391],
    [232, -0.615661475],
    [233, -0.601815023],
    [234, -0.587785252],
    [235, -0.573576436],
    [236, -0.559192903],
    [237, -0.544639035],
    [238, -0.529919264],
    [239, -0.515038075],
    [240, -0.5],
    [241, -0.48480962],
    [242, -0.469471563],
    [243, -0.4539905],
    [244, -0.438371147],
    [245, -0.422618262],
    [246, -0.406736643],
    [247, -0.390731128],
    [248, -0.374606593],
    [249, -0.35836795],
    [250, -0.342020143],
    [251, -0.325568154],
    [252, -0.309016994],
    [253, -0.292371705],
    [254, -0.275637356],
    [255, -0.258819045],
    [256, -0.241921896],
    [257, -0.224951054],
    [258, -0.207911691],
    [259, -0.190808995],
    [260, -0.173648178],
    [261, -0.156434465],
    [262, -0.139173101],
    [263, -0.121869343],
    [264, -0.104528463],
    [265, -0.087155743],
    [266, -0.069756474],
    [267, -0.052335956],
    [268, -0.034899497],
    [269, -0.017452406],
    [270, -1.83772E-16],
    [271, 0.017452406],
    [272, 0.034899497],
    [273, 0.052335956],
    [274, 0.069756474],
    [275, 0.087155743],
    [276, 0.104528463],
    [277, 0.121869343],
    [278, 0.139173101],
    [279, 0.156434465],
    [280, 0.173648178],
    [281, 0.190808995],
    [282, 0.207911691],
    [283, 0.224951054],
    [284, 0.241921896],
    [285, 0.258819045],
    [286, 0.275637356],
    [287, 0.292371705],
    [288, 0.309016994],
    [289, 0.325568154],
    [290, 0.342020143],
    [291, 0.35836795],
    [292, 0.374606593],
    [293, 0.390731128],
    [294, 0.406736643],
    [295, 0.422618262],
    [296, 0.438371147],
    [297, 0.4539905],
    [298, 0.469471563],
    [299, 0.48480962],
    [300, 0.5],
    [301, 0.515038075],
    [302, 0.529919264],
    [303, 0.544639035],
    [304, 0.559192903],
    [305, 0.573576436],
    [306, 0.587785252],
    [307, 0.601815023],
    [308, 0.615661475],
    [309, 0.629320391],
    [310, 0.64278761],
    [311, 0.656059029],
    [312, 0.669130606],
    [313, 0.68199836],
    [314, 0.69465837],
    [315, 0.707106781],
    [316, 0.7193398],
    [317, 0.731353702],
    [318, 0.743144825],
    [319, 0.75470958],
    [320, 0.766044443],
    [321, 0.777145961],
    [322, 0.788010754],
    [323, 0.79863551],
    [324, 0.809016994],
    [325, 0.819152044],
    [326, 0.829037573],
    [327, 0.838670568],
    [328, 0.848048096],
    [329, 0.857167301],
    [330, 0.866025404],
    [331, 0.874619707],
    [332, 0.882947593],
    [333, 0.891006524],
    [334, 0.898794046],
    [335, 0.906307787],
    [336, 0.913545458],
    [337, 0.920504853],
    [338, 0.927183855],
    [339, 0.933580426],
    [340, 0.939692621],
    [341, 0.945518576],
    [342, 0.951056516],
    [343, 0.956304756],
    [344, 0.961261696],
    [345, 0.965925826],
    [346, 0.970295726],
    [347, 0.974370065],
    [348, 0.978147601],
    [349, 0.981627183],
    [350, 0.984807753],
    [351, 0.987688341],
    [352, 0.990268069],
    [353, 0.992546152],
    [354, 0.994521895],
    [355, 0.996194698],
    [356, 0.99756405],
    [357, 0.998629535],
    [358, 0.999390827],
    [359, 0.999847695],
    [360, 1]
  ];

  chart = anychart.polar()
      .container('container')
      .startAngle(0);

  chart.yScale().minimum(-1).maximum(1.5);
  chart.yScale().ticks().interval(.5);

  chart.xScale().maximum(360);
  chart.xScale().ticks().interval(15);

  chart.yAxis().minorTicks().enabled(false);
  chart.xAxis().labels()
      .textFormatter(function() {
        return this['value'] + '°'
      });
  chart.title(null);

  chart.grid(0).oddFill('rgb(255, 255, 255)').evenFill('rgb(250, 250, 250)');
  chart.grid(1).oddFill(null).evenFill(null);

  var background = chart.background().enabled(true);
  background.fill(['rgb(255,255,255)', 'rgb(243,243,243)', 'rgb(255,255,255)'], 90);

  chart.legend()
      .enabled(true)
      .position(anychart.enums.Orientation.RIGHT)
      .itemsLayout(anychart.enums.Layout.VERTICAL)
      .align('left');

  chart.palette(['3 rgb(29, 139, 209)', '3 rgb(241, 104, 60)']);


  var series1 = chart.line(data).name('SINE');
  series1.markers(null);
  var series2 = chart.line(data2).name('COSINE');
  series2.markers(null);

  chart.draw();
});