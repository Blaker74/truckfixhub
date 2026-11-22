const components = {
  "Clutch actuator or cylinder": [
    "Transmission tag and clutch actuation arrangement",
    "Copy the transmission model and serial from its tag. Describe which lines are visible and where the actuator mounts.",
    "Assembly in place, maker mark or label, line connections and mounting face."
  ],
  "Starter or alternator": [
    "Engine identification and electrical connections",
    "Record the engine model and serial, unit label and connector markings. Transcribe the voltage if marked.",
    "Full unit label, mounting pattern and terminal or plug layout."
  ],
  "Valve or air dryer": [
    "Assembly identity and port layout",
    "Copy the complete assembly label. Record visible port labels and the position of any electrical connector. Distinguish a cartridge request from a complete assembly.",
    "Whole assembly, readable tag, visible port labels and connector."
  ],
  "Axle or wheel-end part": [
    "Axle identity and position",
    "Record the axle maker, model and serial. Specify steer, drive or trailer, axle position and side. Identify any number on the component itself.",
    "Axle tag, installed location and readable markings on the part."
  ],
  "Other or unidentified part": [
    "Installed location and connections",
    "Describe where the part sits, what it connects to and every stamped or printed marking. Mark uncertain characters with a question mark.",
    "Wide view for context, label close-up and a second angle showing connections."
  ]
};

const get = id => document.getElementById(id);
const value = id => get(id).value.trim();
const details = new Map();
let lastComponent = '';
function update() {
  const component = value('component');
  if (lastComponent !== component) {
    details.set(lastComponent, get('detail').value);
    get('detail').value = details.get(component) || '';
    lastComponent = component;
  }
  const prompts = components[component];
  get('specific').hidden = !prompts;
  get('copy').disabled = get('print').disabled = !prompts;
  get('status').textContent = '';
  if (!prompts) {
    get('output').value = '';
    return;
  }
  const [label, hint, photos] = prompts;
  get('detail-label').textContent = label;
  get('hint').textContent = hint;
  get('photos').textContent = photos;
  const items = [
    ['Component', component], ['Vehicle', value('truck')], ['Markings', value('marks')],
    ['Location or item requested', value('location')], [label, value('detail')],
    ['Open questions', value('notes')]
  ];
  get('output').value = [
    'Please help identify and quote this part.',
    ...items.map(([key, val]) => key + ': ' + (val || 'Unknown')),
    'Photo checklist: ' + photos,
    'Please confirm the service part number and any fitment details still needed before ordering.'
  ].join('\n');
}
get('builder').addEventListener('input', update);
get('component').addEventListener('change', update);
get('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(get('output').value);
    get('status').textContent = 'Request copied.';
  } catch {
    get('output').focus();
    get('output').select();
    get('status').textContent = 'Request selected. Use your device’s Copy command.';
  }
});
get('print').addEventListener('click', () => window.print());
get('builder').hidden = false;
update();
window.addEventListener('beforeprint', () => { get('output').parentElement.dataset.print = get('output').value; });
