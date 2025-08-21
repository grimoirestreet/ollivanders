import React, { useState, useMemo, useCallback } from 'react';

// Data constants
const EXPERIENCE_LEVELS = [
  { id: 1, label: 'Student (Ages 11-18)', minLength: 9, maxLength: 13 },
  { id: 2, label: 'Young Adult (Ages 19-30)', minLength: 8, maxLength: 14 },
  { id: 3, label: 'Experienced Adult (Ages 31-50)', minLength: 7, maxLength: 16 },
  { id: 4, label: 'Elder (Ages 51+)', minLength: 7, maxLength: 17 }
];

const WOODS = [
  // Common Woods (Level 1+)
  { id: 'oak', name: 'Oak', description: 'A wand for reliable friends; Oak demands partners of strength, courage and fidelity. The oak tree is called King of the Forest for good reason - its wands create natural leaders and steadfast protectors.', level: 1, category: 'Common' },
  { id: 'birch', name: 'Birch', description: 'Young and eager, birch wands match those ready for new adventures. Known for adaptability and fresh starts, these wands help their owners overcome past mistakes and embrace positive change.', level: 1, category: 'Common' },
  { id: 'willow', name: 'Willow', description: 'Graceful and intuitive, willow wands choose healers and those with hidden potential. These wands excel at healing magic and possess an almost uncanny ability to perform non-verbal spells with those who have untapped gifts.', level: 1, category: 'Common' },
  { id: 'cedar', name: 'Cedar', description: 'Cedar wands find those with strength of character and unusual loyalty. Often remaining faithful for life to the first master who proves worthy, cedar wands are known to emit a warm, woody scent when happy.', level: 1, category: 'Common' },
  { id: 'pine', name: 'Pine', description: 'Independent and mysterious, pine wands seek the solitary traveler and free spirit. Most sensitive to non-verbal magic, they prefer owners who march to their own beat rather than follow the crowd.', level: 1, category: 'Common' },
  { id: 'maple', name: 'Maple', description: 'Maple wands love new experiences and fresh challenges. These ambitious wands choose natural explorers and ambitious spellcasters, thriving on variety and travel rather than routine magical practice.', level: 1, category: 'Common' },
  { id: 'beech', name: 'Beech', description: 'The wisest of woods, beech wands seek the articulate and tolerant. Those young in years but wise beyond their age often find themselves chosen by beech, though it will work poorly for the narrow-minded.', level: 1, category: 'Common' },
  { id: 'apple', name: 'Apple', description: 'Associated with love and healing, apple wands are drawn to those who value life and growth. These wands excel at charms and nature magic, and are said to work poorly for those who practice the Dark Arts.', level: 1, category: 'Common' },
  { id: 'poplar', name: 'Poplar', description: 'Honest and reliable, poplar wands prefer consistency over flash. Known for their moral fiber, these wands work best for those who value substance over style and keep their word once given.', level: 1, category: 'Common' },
  { id: 'ash', name: 'Ash', description: 'Stubborn but loyal, ash wands bond deeply with one master and perform poorly if ownership changes. These wands excel at defensive magic and protective charms, never switching allegiance lightly.', level: 1, category: 'Common' },
  
  // Rare Woods (Level 2+)
  { id: 'holly', name: 'Holly', description: 'Protective and pure, holly wands choose those who need to overcome anger and hatred. Often found in the hands of those facing dangerous adversaries, holly wands repel evil and help their owners maintain noble hearts even in dark times.', level: 2, category: 'Rare' },
  { id: 'hawthorn', name: 'Hawthorn', description: 'Complex and contradictory like its owners, hawthorn wands excel at healing magic while also proving adept at curses. These wands are drawn to those with conflicted natures or who have endured great turmoil.', level: 2, category: 'Rare', requires: ['trauma'] },
  { id: 'rowan', name: 'Rowan', description: 'Known as the clearest-thinking wand, rowan has strong protective properties against dark creatures. These wands choose the pure-hearted and are particularly effective against Dementors and other dark entities.', level: 2, category: 'Rare' },
  { id: 'walnut', name: 'Walnut', description: 'Highly intelligent wands that seek innovative and inventive masters. Walnut wands have one pronounced quirk - they are abnormally versatile and will adapt to their owner\'s style of magic rather than the reverse.', level: 2, category: 'Rare' },
  { id: 'cherry', name: 'Cherry', description: 'Rare and highly prized, cherry wands are drawn to those with exceptional self-control and mental strength. These wands can produce powerful magic but demand considerable skill and maturity from their wielders.', level: 2, category: 'Rare' },
  { id: 'rosewood', name: 'Rosewood', description: 'Elegant and refined, rosewood wands favor those with natural charm and sophisticated magical technique. Known for their beautiful appearance and smooth performance, they enhance charisma-based magic.', level: 2, category: 'Rare' },
  { id: 'vine', name: 'Vine', description: 'Vine wands seek owners with hidden depths and surprise those around them. These wands are drawn to witches and wizards who seem ordinary but possess extraordinary character hidden beneath the surface.', level: 2, category: 'Rare' },
  { id: 'chestnut', name: 'Chestnut', description: 'Attracted to wizards skilled with magical creatures and those drawn to justice. Chestnut wands are particularly gifted at Transfiguration and beast-related magic, preferring partners with strong moral convictions.', level: 2, category: 'Rare' },
  { id: 'mahogany', name: 'Mahogany', description: 'Mahogany wands are particularly suited for Transfiguration magic. These adaptable wands seek those who embrace change and transformation, both magical and personal, throughout their lives.', level: 2, category: 'Rare' },
  { id: 'hornbeam', name: 'Hornbeam', description: 'Hornbeam wands adapt wonderfully to their owner\'s individual style of magic. These personable wands become so attuned to their owner that they absorb their code of honor and refuse to perform acts contrary to their master\'s principles.', level: 2, category: 'Rare' },
  { id: 'blackthorn', name: 'Blackthorn', description: 'A warrior\'s wand, blackthorn becomes most powerful after passing through danger with its partner. These wands are drawn to those who have survived great hardship and emerged stronger for the experience.', level: 2, category: 'Rare' },
  { id: 'cypress', name: 'Cypress', description: 'Associated with death, rebirth, and eternal life, cypress wands are drawn to brave souls who sacrifice themselves for others. These noble wands help their owners guide others through transitions and transformations.', level: 2, category: 'Rare' },
  
  // Elite Woods (Level 3+)
  { id: 'yew', name: 'Yew', description: 'The rarest of wand woods, yew wands choose those with the power over life and death. Neither good nor evil, these complex wands can produce the most powerful magic and are drawn to those who will face their shadow self.', level: 3, category: 'Elite' },
  { id: 'ebony', name: 'Ebony', description: 'Happiest in the hand of those unafraid to be themselves, ebony wands hold impressive defensive abilities. They are often the companions of combative magic users who will not yield under pressure.', level: 3, category: 'Elite' },
  { id: 'redwood', name: 'Redwood', description: 'Ancient and patient, redwood wands favor those who think in terms of decades rather than days. These wise wands are drawn to visionaries and long-term planners who see the bigger picture.', level: 3, category: 'Elite' },
  { id: 'larch', name: 'Larch', description: 'Larch wands instill courage and confidence in their owners. Known for bringing out hidden talents and helping overcome self-doubt, these encouraging wands never abandon their partners in times of need.', level: 3, category: 'Elite' },
  { id: 'alder', name: 'Alder', description: 'Alder wands are drawn to the helpful and considerate. These cooperative wands excel at supportive magic and protective charms, preferring partners who put others\' needs before their own.', level: 3, category: 'Elite' },
  { id: 'dogwood', name: 'Dogwood', description: 'Playful and mischievous, dogwood wands choose fun-loving partners with good hearts. These spirited wands excel at charm work and light magic, bringing joy and laughter to their owner\'s magical practice.', level: 3, category: 'Elite' },
  { id: 'fir', name: 'Fir', description: 'Wands of survivors, fir chooses those who have endured hardship and emerged with renewed strength. These resilient wands favor focused and determined magic users who overcome obstacles through persistence.', level: 3, category: 'Elite' },
  { id: 'pear', name: 'Pear', description: 'Warm and generous, pear wands are drawn to those who value family and community above personal glory. These nurturing wands excel at protective magic and spells that benefit groups rather than individuals.', level: 3, category: 'Elite' },
  { id: 'spruce', name: 'Spruce', description: 'Bold and adventurous, spruce wands seek those who live life to the fullest. These daring wands thrive on excitement and new experiences, preferring partners who take risks and embrace challenges.', level: 3, category: 'Elite' }
];

const CORES = [
  // Standard Cores
  { id: 'dragon', name: 'Dragon Heartstring', description: 'The most powerful and flamboyant of wand cores, dragon heartstring wands learn spells faster than any other type. While capable of the most spectacular magic, they are also the most prone to accidents and may change allegiance if won from their original master.', level: 1, category: 'Standard', ollivander: true },
  { id: 'phoenix', name: 'Phoenix Feather', description: 'The rarest core type, phoenix feathers are capable of the greatest range of magic. These independent cores sometimes act of their own accord and are the pickiest when choosing a wizard. Once bonded, they show the most initiative and may perform magic without command.', level: 1, category: 'Standard', ollivander: true },
  { id: 'unicorn', name: 'Unicorn Hair', description: 'The most faithful of cores, unicorn hair produces the most consistent magic and is least subject to fluctuations. These wands are hardest to turn to the Dark Arts and will warn their owner of danger by emitting silvery smoke. If the original owner dies, the wand may never perform the same.', level: 1, category: 'Standard', ollivander: true },
  
  // Specialty Cores (Level 2+)
  { id: 'thestral', name: 'Thestral Hair', description: 'Only visible to those who have witnessed death, thestral hair cores are exceptionally powerful for magic involving death, souls, and the afterlife. These cores are temperamental and require emotional maturity, often refusing to work for those who haven\'t truly understood loss.', level: 2, category: 'Specialty', requires: ['death'] },
  { id: 'veela', name: 'Veela Hair', description: 'Temperamental and powerful for charm magic, veela hair cores are highly sought after for their beauty and emotional resonance. These cores excel at enchantments and mood-altering magic but may become volatile if their owner\'s emotions run high.', level: 2, category: 'Specialty', requires: ['veela'] },
  { id: 'giant', name: 'Giant Hair', description: 'Immensely strong but difficult to control, giant hair cores provide raw magical power and physical enhancement. These cores are drawn to those with giant ancestry and excel at strength-based magic, though they can be unpredictable.', level: 2, category: 'Specialty', requires: ['giant'] },
  { id: 'siren', name: 'Siren Scale', description: 'Enchanting and persuasive, siren scale cores excel at vocal magic and mental influence. These cores enhance the owner\'s natural charisma and musical abilities, but may compel them to use their voice to manipulate others.', level: 2, category: 'Specialty', requires: ['siren'] },
  { id: 'thunderbird', name: 'Thunderbird Feather', description: 'A powerful core for weather magic and divination, thunderbird feathers are sensitive to supernatural danger and may cast spells of their own accord in response to threats. These cores create wands particularly suited to Transfiguration and defensive magic.', level: 2, category: 'Specialty' },
  { id: 'griffin', name: 'Griffin Feather', description: 'Known for creating wands of great courage and nobility, griffin feathers bond strongly with brave souls and those who stand up for others. These cores excel at protective magic and will refuse to work for cowards or those who abandon their principles.', level: 2, category: 'Specialty' },
  { id: 'dragon_scale', name: 'Dragon Scale', description: 'More stable than heartstring but still impressively powerful, dragon scale cores provide excellent defense against magical attacks. These cores are particularly suited to protective charms and counter-curses, offering steady power without the volatility of heartstring.', level: 2, category: 'Specialty' },
  { id: 'sphinx', name: 'Sphinx Hair', description: 'Cores of pure intellect, sphinx hair creates wands that excel at mental magic, riddles, and complex spellwork. These thoughtful cores prefer methodical, intellectual approaches to magic and work poorly for those who rely on instinct over analysis.', level: 2, category: 'Specialty' },
  
  // Creature Cores (Level 3+)
  { id: 'acromantula', name: 'Acromantula Silk', description: 'Dark and binding, acromantula silk cores excel at trap magic, web spells, and complex enchantments that ensnare opponents. These cores are patient and calculating, preferring subtle manipulation to direct confrontation.', level: 3, category: 'Creature' },
  { id: 'bowtruckle', name: 'Bowtruckle Bark', description: 'Gentle and nurturing, bowtruckle bark cores create wands with deep connections to plant life and nature magic. These peaceful cores excel at healing, growth spells, and communication with magical plants and trees.', level: 3, category: 'Creature' },
  { id: 'hippogriff', name: 'Hippogriff Talon', description: 'Proud and noble, hippogriff talon cores create wands suited for flight magic and wind spells. These cores demand respect from their owners and will refuse to work properly for those who show arrogance or disrespect to magical creatures.', level: 3, category: 'Creature' },
  { id: 'centaur', name: 'Centaur Hair', description: 'Wise and far-seeing, centaur hair cores excel at divination and astronomy-based magic. These ancient cores prefer owners who think before acting and have deep respect for the old ways of magic and natural wisdom.', level: 3, category: 'Creature' },
  { id: 'banshee', name: 'Banshee Hair', description: 'Mournful yet prophetic, banshee hair cores are extraordinarily powerful for emotional magic and death omens. These cores can sense approaching tragedy and may emit haunting sounds to warn their owners of coming sorrow.', level: 3, category: 'Creature' },
  { id: 'mermaid', name: 'Mermaid Scale', description: 'Fluid and adaptable, mermaid scale cores excel at water magic and emotional manipulation. These cores allow their owners to breathe underwater and enhance their natural charisma, though they may become difficult to control during emotional storms.', level: 3, category: 'Creature' },
  
  // Elemental Cores (Level 4+)
  { id: 'lightning', name: 'Crystallized Lightning', description: 'Raw power incarnate, crystallized lightning cores are among the most dangerous to wield. These volatile cores can produce incredible displays of magical might but may shock their owner if used in anger. They respond best to calm, controlled magic users.', level: 4, category: 'Elemental' },
  { id: 'flame', name: 'Frozen Flame', description: 'A paradox of opposing elements, frozen flame cores grant mastery over both fire and ice magic. These complex cores require mental balance and emotional control, as they may burn or freeze uncontrollably if their owner loses focus.', level: 4, category: 'Elemental' },
  { id: 'starlight', name: 'Starlight Silver', description: 'Pure and celestial, starlight silver cores excel at light magic, purification, and astronomical spells. These cores draw power from the night sky and work best during darkness, creating wands that can banish shadows and reveal hidden truths.', level: 4, category: 'Elemental' },
  { id: 'shadow', name: 'Shadow Essence', description: 'Dark and mysterious, shadow essence cores are masters of concealment and illusion magic. These elusive cores can bend light and perception, creating wands perfect for stealth work and subtle manipulation of reality.', level: 4, category: 'Elemental' },
  { id: 'wind', name: 'Wind Crystal', description: 'Free and ever-moving, wind crystal cores excel at air magic and speed enhancement. These restless cores prefer owners who embrace change and movement, creating wands that can manipulate weather and grant swiftness to their wielders.', level: 4, category: 'Elemental' },
  { id: 'earth', name: 'Earth Heart', description: 'Steady and enduring, earth heart cores provide incredible stability and strength-based magic. These ancient cores connect their owners to the planet\'s power, creating wands capable of moving mountains and standing against any force.', level: 4, category: 'Elemental' }
];

const FLEXIBILITY_OPTIONS = [
  'Unyielding', 'Brittle', 'Rigid', 'Hard', 'Unbending', 'Reasonably Supple',
  'Quite Bendy', 'Pliable', 'Pliant', 'Supple', 'Whippy', 'Swishy', 'Springy',
  'Yielding', 'Flexible', 'Very Flexible'
];

const FINISH_OPTIONS = [
  { id: 'smooth', name: 'Smooth', description: 'Clean, simple design' },
  { id: 'polished', name: 'Polished', description: 'Refined, elegant look' },
  { id: 'carved', name: 'Carved', description: 'Intricate patterns' },
  { id: 'rustic', name: 'Rustic', description: 'Natural, unfinished' },
  { id: 'ancient', name: 'Ancient', description: 'Weathered, historic' },
  { id: 'battle_worn', name: 'Battle-Worn', description: 'Scarred from combat' }
];

export default function WandBuilder() {
  // Core state
  const [level, setLevel] = useState(1);
  const [wood, setWood] = useState(null);
  const [core, setCore] = useState(null);
  const [customCore, setCustomCore] = useState('');
  const [isCustomCore, setIsCustomCore] = useState(false);
  // Remove ollivanderOnly from state since we're not using it anymore
  const [length, setLength] = useState(11);
  const [flexibility, setFlexibility] = useState('Reasonably Supple');
  const [finish, setFinish] = useState('smooth');
  
  // Special circumstances
  const [circumstances, setCircumstances] = useState({
    prodigy: false,
    lateBloomer: false,
    heirloom: false,
    death: false,
    trauma: false,
    veela: false,
    giant: false,
    siren: false
  });
  
  const [customDrawbacks, setCustomDrawbacks] = useState('');
  const [playerNotes, setPlayerNotes] = useState('');
  const [showTraditions, setShowTraditions] = useState(false);
  
  // Computed values
  const effectiveLevel = useMemo(() => {
    if (circumstances.lateBloomer) return 1;
    let level_ = level;
    if (circumstances.prodigy) level_ += 1;
    if (circumstances.heirloom) level_ += 1;
    return Math.min(level_, 4);
  }, [level, circumstances]);
  
  const currentLevelData = EXPERIENCE_LEVELS.find(l => l.id === level);
  
  const availableWoods = useMemo(() => {
    return WOODS.filter(w => {
      // Special case: if wood has requirements and they're met, allow regardless of level
      if (w.requires && w.requires.every(req => circumstances[req])) {
        return true;
      }
      
      // Otherwise check level requirement
      if (w.level > effectiveLevel) return false;
      
      // If no special requirements, it's available at the right level
      return true;
    }).sort((a, b) => {
      if (a.category !== b.category) {
        const order = { 'Common': 0, 'Rare': 1, 'Elite': 2 };
        return order[a.category] - order[b.category];
      }
      return a.name.localeCompare(b.name);
    });
  }, [effectiveLevel, circumstances]);
  
  const availableCores = useMemo(() => {
    return CORES.filter(c => {
      // Special case: if core has requirements and they're met, allow regardless of level
      if (c.requires && c.requires.every(req => circumstances[req])) {
        return true;
      }
      
      // Otherwise check level requirement
      if (c.level > effectiveLevel) return false;
      
      // If no special requirements, it's available at the right level
      return true;
    }).sort((a, b) => {
      if (a.category !== b.category) {
        const order = { 'Standard': 0, 'Specialty': 1, 'Creature': 2, 'Elemental': 3 };
        return order[a.category] - order[b.category];
      }
      return a.name.localeCompare(b.name);
    });
  }, [effectiveLevel, circumstances]);
  
  // Validation
  const requirements = useMemo(() => {
    const reqs = [
      { 
        name: 'Wood', 
        met: wood && availableWoods.includes(wood),
        missing: !wood ? 'No wood selected' : !availableWoods.includes(wood) ? 'Wood not available for current level' : null
      },
      { 
        name: 'Core', 
        met: (core && availableCores.includes(core)) || (isCustomCore && customCore.trim().length > 0),
        missing: (!core && !isCustomCore) ? 'No core selected' : 
                (!availableCores.includes(core) && !isCustomCore) ? 'Core not available for current level' :
                (isCustomCore && customCore.trim().length === 0) ? 'Custom core name required' : null
      },
      { 
        name: 'Length', 
        met: length >= currentLevelData.minLength && length <= 20,
        missing: length < currentLevelData.minLength ? 'Length too short for level' : length > 20 ? 'Length exceeds maximum' : null
      },
      { 
        name: 'Special Circumstances', 
        met: !(circumstances.prodigy && circumstances.lateBloomer),
        missing: (circumstances.prodigy && circumstances.lateBloomer) ? 'Cannot be both Prodigy and Late Bloomer' : null
      }
    ];
    
    const metCount = reqs.filter(r => r.met).length;
    const missing = reqs.filter(r => !r.met && r.missing).map(r => r.missing);
    
    return { metCount, total: reqs.length, missing };
  }, [wood, core, length, circumstances, availableWoods, availableCores, currentLevelData, isCustomCore, customCore]);
  
  const approvalStatus = useMemo(() => {
    if (requirements.missing.length > 0) {
      return { code: 'invalid', message: 'Please fix the issues listed below' };
    }
    
    // Check for review requirements
    if (length >= 17) {
      return { code: 'review', message: 'Extreme length requires staff approval' };
    }
    
    if (circumstances.prodigy || circumstances.heirloom) {
      return { code: 'review', message: 'Special circumstances require staff approval' };
    }
    
    if (isCustomCore) {
      return { code: 'review', message: 'Custom core requires staff approval' };
    }
    
    if (core && (core.category === 'Elemental' || (core.requires && core.requires.length > 0))) {
      return { code: 'review', message: 'Specialty core requires staff approval' };
    }
    
    return { code: 'ok', message: 'Available for immediate use' };
  }, [requirements, length, circumstances, core, isCustomCore]);
  
  // Helper functions
  const formatLength = (len) => {
    const whole = Math.floor(len);
    const fraction = len - whole;
    const fractionMap = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' };
    return `${whole}${fractionMap[fraction] || ''}\"`;
  };
  
  const generateWandDescription = () => {
    if (!wood || !core) return 'Select wood and core to see description';
    
    return `A ${formatLength(length)} ${wood.name} wand with ${core.name} core, ${flexibility.toLowerCase()}.`;
  };
  
  const generateDetailedAnalysis = () => {
    if (!wood || !core) return '';
    
    const analysis = [];
    
    // Wood analysis based on selection and circumstances
    let woodAnalysis = `This ${wood.name.toLowerCase()} wand`;
    
    // Add personality matching based on wood
    if (wood.id === 'holly' && (circumstances.trauma || circumstances.death)) {
      woodAnalysis += ' recognized your pure heart despite the darkness you\'ve witnessed, choosing you for your ability to maintain hope through adversity.';
    } else if (wood.id === 'hawthorn' && circumstances.trauma) {
      woodAnalysis += ' was drawn to your complex nature and healing journey, sensing both your wounds and your strength to overcome them.';
    } else if (wood.id === 'yew') {
      woodAnalysis += ' chose you for your deep understanding of life\'s mysteries and your fearless approach to transformation.';
    } else if (wood.id === 'oak') {
      woodAnalysis += ' sensed your natural leadership qualities and unwavering loyalty to those you protect.';
    } else if (wood.id === 'willow') {
      woodAnalysis += ' recognized your hidden potential and intuitive magical abilities waiting to be unlocked.';
    } else if (wood.id === 'pine') {
      woodAnalysis += ' was attracted to your independent spirit and preference for walking your own path.';
    } else if (wood.id === 'ebony') {
      woodAnalysis += ' chose you for your authentic courage and refusal to compromise your true self.';
    } else {
      woodAnalysis += ` chose you for your natural affinity with its ${wood.name.toLowerCase()} properties and matching personality traits.`;
    }
    
    analysis.push(woodAnalysis);
    
    // Core analysis based on selection and circumstances  
    let coreAnalysis = `The ${core.name.toLowerCase()} core`;
    
    if (core.id === 'thestral' && circumstances.death) {
      coreAnalysis += ' resonates with your experience of loss, granting you insight into death magic and the ability to see truths hidden from others.';
    } else if (core.id === 'veela' && circumstances.veela) {
      coreAnalysis += ' connects with your Veela heritage, amplifying your natural charm and emotional magic while requiring careful control of your temperament.';
    } else if (core.id === 'giant' && circumstances.giant) {
      coreAnalysis += ' draws upon your giant ancestry, providing raw magical power and physical enhancement suited to your heritage.';
    } else if (core.id === 'siren' && circumstances.siren) {
      coreAnalysis += ' harmonizes with your siren blood, enhancing your vocal magic and natural ability to influence others through sound.';
    } else if (core.id === 'dragon') {
      coreAnalysis += ' amplifies your ambitious nature and desire for spectacular magic, though it may challenge you to prove your worthiness.';
    } else if (core.id === 'phoenix') {
      coreAnalysis += ' mirrors your independent spirit and capacity for rebirth, offering the greatest magical versatility to match your complex nature.';
    } else if (core.id === 'unicorn') {
      coreAnalysis += ' bonds with your pure intentions and loyal heart, providing steady, consistent magic that will never betray your moral compass.';
    } else {
      coreAnalysis += ` enhances your natural magical abilities, creating perfect synergy between your personality and your wand's power.`;
    }
    
    analysis.push(coreAnalysis);
    
    // Add special circumstance analysis
    if (circumstances.prodigy) {
      analysis.push('Your exceptional talent has drawn a wand of unusual power for someone of your experience level, reflecting your extraordinary potential.');
    }
    
    if (circumstances.heirloom) {
      analysis.push('As a family heirloom, this wand carries the magical legacy of your ancestors, their experiences woven into its very core.');
    }
    
    if (circumstances.lateBloomer) {
      analysis.push('Though you came to magic later than most, this wand recognizes your genuine desire to learn and will grow stronger as you develop your abilities.');
    }
    
    // Add length/flexibility insight
    if (length >= 15) {
      analysis.push('The unusual length of this wand suggests you are destined for great deeds and dramatic magical displays.');
    } else if (length <= 9) {
      analysis.push('The compact size of this wand indicates your preference for subtle, precise magic over flashy displays.');
    }
    
    return analysis;
  };
  
  const copyToClipboard = () => {
    const summary = `═══════════════════════════════════════
       OLLIVANDER'S WAND REGISTRY
           Character Profile
═══════════════════════════════════════

**WIZARD PROFILE:**
Name: [To be completed by player]
Experience Level: ${currentLevelData.label}
Special Circumstances: ${Object.entries(circumstances).filter(([_, v]) => v).map(([k, _]) => k).join(', ') || 'None'}

**WAND SPECIFICATIONS:**
• Length: ${formatLength(length)}
• Wood: ${wood?.name || 'Not selected'}
• Core: ${isCustomCore ? customCore || 'Custom core' : core?.name || 'Not selected'}
• Flexibility: ${flexibility}
• Finish: ${FINISH_OPTIONS.find(f => f.id === finish)?.name || 'Smooth'}

**COMPLETE DESCRIPTION:**
"${generateWandDescription()}"

**APPROVAL STATUS:** ${approvalStatus.code === 'ok' ? '✓ Auto-approved' : approvalStatus.code === 'review' ? '⚠️ Requires staff approval' : '❌ Invalid - needs correction'}

**REQUIREMENTS MET:** ${requirements.metCount}/${requirements.total}
${requirements.missing.length > 0 ? `
**MISSING:**
${requirements.missing.map(m => `• ${m}`).join('\n')}` : ''}

${customDrawbacks ? `**CUSTOM DRAWBACKS:**
${customDrawbacks}
` : ''}${playerNotes ? `**PLAYER NOTES:**
${playerNotes}
` : ''}
**REGISTRATION DATE:** ${new Date().toLocaleDateString()}
**WANDMAKER:** Gerbold Ollivander

═══════════════════════════════════════`;
    
    // Fallback for older browsers
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summary);
    } else {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = summary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };
  
  const randomize = () => {
    const randomWood = availableWoods[Math.floor(Math.random() * availableWoods.length)];
    const randomCore = availableCores[Math.floor(Math.random() * availableCores.length)];
    const randomLength = Math.round((Math.random() * (currentLevelData.maxLength - currentLevelData.minLength) + currentLevelData.minLength) * 4) / 4;
    const randomFlex = FLEXIBILITY_OPTIONS[Math.floor(Math.random() * FLEXIBILITY_OPTIONS.length)];
    const randomFinish = FINISH_OPTIONS[Math.floor(Math.random() * FINISH_OPTIONS.length)];
    
    setWood(randomWood);
    setCore(randomCore);
    setLength(randomLength);
    setFlexibility(randomFlex);
    setFinish(randomFinish.id);
  };
  
  const reset = () => {
    setLevel(1);
    setWood(null);
    setCore(null);
    setCustomCore('');
    setIsCustomCore(false);
    setLength(11);
    setFlexibility('Reasonably Supple');
    setFinish('smooth');
    setCircumstances({
      prodigy: false, lateBloomer: false, heirloom: false,
      death: false, trauma: false, veela: false, giant: false, siren: false
    });
    setCustomDrawbacks('');
    setPlayerNotes('');
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerbold Ollivander's Wandshop • Builder</h1>
          <div className="flex space-x-3">
            <button onClick={randomize} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors">
              Randomize
            </button>
            <button onClick={reset} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors">
              Reset
            </button>
            <button onClick={copyToClipboard} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded transition-colors">
              Copy Summary
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex">
        {/* Left Panel - Selections */}
        <div className="w-1/2 p-6 space-y-6">
          {/* Wand Traditions Panel */}
          <div className="bg-gray-700 rounded-lg">
            <button 
              onClick={() => setShowTraditions(!showTraditions)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-600 transition-colors rounded-lg"
            >
              <span className="text-sm font-medium text-gray-200">1890s Wandmaking Traditions & Care</span>
              <span className="text-gray-400">{showTraditions ? '−' : '+'}</span>
            </button>
            
            {showTraditions && (
              <div className="px-4 pb-4 text-xs text-gray-300 space-y-3">
                <div>
                  <h4 className="font-medium text-gray-200 mb-1">Guild Regulations</h4>
                  <p>Master wandmakers must complete a seven-year apprenticeship under Guild supervision. Each wand is registered with the Royal Registry of Magical Implements, bearing the maker's seal and date of completion.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-200 mb-1">Seasonal Crafting</h4>
                  <p><strong>Spring:</strong> Young wood harvesting, student wands<br/>
                  <strong>Summer:</strong> Core preparation, binding rituals<br/>
                  <strong>Autumn:</strong> Combat wands, protective enchantments<br/>
                  <strong>Winter:</strong> Rare and delicate wand creation</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-200 mb-1">Proper Etiquette</h4>
                  <p>• Never display your wand openly in polite society<br/>
                  • Gentlemen wear wand holsters beneath their waistcoats<br/>
                  • Ladies conceal wands in specially charmed reticules or sleeve holsters<br/>
                  • Examining another's wand without permission is gravely insulting</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-200 mb-1">Daily Maintenance</h4>
                  <p>• Polish wood weekly with beeswax and moonstone oil<br/>
                  • Store in silk-lined cases to preserve core sensitivity<br/>
                  • Never expose to direct sunlight for extended periods<br/>
                  • Perform cleansing rituals after dark magic encounters</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-200 mb-1">Troubleshooting</h4>
                  <p><strong>Sparking uncontrollably:</strong> Over-excitement, practice calming exercises<br/>
                  <strong>Refusing to cast:</strong> Misalignment with owner's moral choices<br/>
                  <strong>Emitting smoke:</strong> Warning of danger or dark magic nearby<br/>
                  <strong>Warm to touch:</strong> Content and well-bonded with owner</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-200 mb-1">Ollivander Family Wisdom</h4>
                  <p className="italic">"Remember, young wandmaker, that the wand chooses the wizard. Our role is merely to facilitate this ancient bond, not to force it. A wand that does not wish to serve will bring nothing but frustration to its wielder."</p>
                  <p className="text-xs text-gray-400 mt-1">— Gerbold Ollivander, Master Wandmaker</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-200 mb-1">Emergency Repairs</h4>
                  <p>Minor damage may be addressed with unicorn hair binding and phoenix ash. Severe breaks require return to the original maker. <strong>Never</strong> attempt repairs with foreign cores - this violates the wand's essential nature.</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Selections</h2>
            
            {/* Experience Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Experience Level</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              >
                {EXPERIENCE_LEVELS.map(lvl => (
                  <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                ))}
              </select>
            </div>
            
            {/* Special Circumstances */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-gray-300">Special Circumstances</legend>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.prodigy}
                    onChange={(e) => setCircumstances(prev => ({...prev, prodigy: e.target.checked}))}
                  />
                  <span>Prodigy</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.lateBloomer}
                    onChange={(e) => setCircumstances(prev => ({...prev, lateBloomer: e.target.checked}))}
                  />
                  <span>Late Bloomer</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.heirloom}
                    onChange={(e) => setCircumstances(prev => ({...prev, heirloom: e.target.checked}))}
                  />
                  <span>Family Heirloom</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.death}
                    onChange={(e) => setCircumstances(prev => ({...prev, death: e.target.checked}))}
                  />
                  <span>Witnessed Death</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.trauma}
                    onChange={(e) => setCircumstances(prev => ({...prev, trauma: e.target.checked}))}
                  />
                  <span>Survived Trauma</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.veela}
                    onChange={(e) => setCircumstances(prev => ({...prev, veela: e.target.checked}))}
                  />
                  <span>Part-Veela</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.giant}
                    onChange={(e) => setCircumstances(prev => ({...prev, giant: e.target.checked}))}
                  />
                  <span>Giant Ancestry</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={circumstances.siren}
                    onChange={(e) => setCircumstances(prev => ({...prev, siren: e.target.checked}))}
                  />
                  <span>Siren Heritage</span>
                </label>
              </div>
            </fieldset>
            
            {/* Length */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Length: {formatLength(length)}
              </label>
              <input
                type="range"
                min={7}
                max={20}
                step={0.25}
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400">
                Recommended: {formatLength(currentLevelData.minLength)}-{formatLength(currentLevelData.maxLength)}
              </div>
            </div>
            
            {/* Wood */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Wood</label>
              <select 
                value={wood?.id || ''} 
                onChange={(e) => setWood(WOODS.find(w => w.id === e.target.value) || null)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              >
                <option value="">Select wood...</option>
                {availableWoods.reduce((acc, wood) => {
                  if (acc.lastCategory !== wood.category) {
                    acc.options.push(
                      <option key={`header-${wood.category}`} disabled className="font-bold">
                        ─── {wood.category.toUpperCase()} WOODS ───
                      </option>
                    );
                    acc.lastCategory = wood.category;
                  }
                  acc.options.push(
                    <option key={wood.id} value={wood.id}>
                      {wood.name}
                    </option>
                  );
                  return acc;
                }, { options: [], lastCategory: null }).options}
              </select>
            </div>
            
            {/* Core */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Core</label>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={isCustomCore}
                    onChange={(e) => {
                      setIsCustomCore(e.target.checked);
                      if (!e.target.checked) {
                        setCustomCore('');
                      } else {
                        setCore(null);
                      }
                    }}
                  />
                  <span>Use custom core (requires staff approval)</span>
                </label>
                
                {isCustomCore ? (
                  <input
                    type="text"
                    value={customCore}
                    onChange={(e) => setCustomCore(e.target.value)}
                    placeholder="Enter custom core name (e.g., 'Kappa Scale', 'Dementor Wisp')"
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                ) : (
                  <select 
                    value={core?.id || ''} 
                    onChange={(e) => setCore(CORES.find(c => c.id === e.target.value) || null)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
                  >
                    <option value="">Select core...</option>
                    {availableCores.reduce((acc, core) => {
                      if (acc.lastCategory !== core.category) {
                        acc.options.push(
                          <option key={`header-${core.category}`} disabled className="font-bold">
                            ─── {core.category.toUpperCase()} CORES ───
                          </option>
                        );
                        acc.lastCategory = core.category;
                      }
                      acc.options.push(
                        <option key={core.id} value={core.id}>
                          {core.name}
                        </option>
                      );
                      return acc;
                    }, { options: [], lastCategory: null }).options}
                  </select>
                )}
              </div>
            </div>
            
            {/* Flexibility */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Flexibility</label>
              <select 
                value={flexibility} 
                onChange={(e) => setFlexibility(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              >
                {FLEXIBILITY_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* Finish */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Finish</label>
              <select 
                value={finish} 
                onChange={(e) => setFinish(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              >
                {FINISH_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name} - {option.description}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Custom Drawbacks */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Custom Drawbacks</label>
              <textarea
                value={customDrawbacks}
                onChange={(e) => setCustomDrawbacks(e.target.value)}
                placeholder="Add any player-defined drawbacks here..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 h-20 resize-none"
              />
            </div>
            
            {/* Player Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Player Notes</label>
              <textarea
                value={playerNotes}
                onChange={(e) => setPlayerNotes(e.target.value)}
                placeholder="Any flavor notes for RP (appearance, handle, history)..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 h-20 resize-none"
              />
            </div>
          </div>
        </div>
        
        {/* Right Panel - Preview */}
        <div className="w-1/2 p-6 bg-gray-800 space-y-6">
          {/* Approval Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Approval Status</h2>
            <div className={`p-4 rounded ${
              approvalStatus.code === 'ok' ? 'bg-green-900 text-green-100' :
              approvalStatus.code === 'review' ? 'bg-yellow-900 text-yellow-100' :
              'bg-red-900 text-red-100'
            }`}>
              <div className="flex items-center space-x-2">
                {approvalStatus.code === 'ok' && <span>✓</span>}
                {approvalStatus.code === 'review' && <span>⚠️</span>}
                {approvalStatus.code === 'invalid' && <span>❌</span>}
                <span className="font-medium">{approvalStatus.message}</span>
              </div>
              
              <div className="mt-2 text-sm">
                Requirements Met: {requirements.metCount}/{requirements.total}
              </div>
              
              {requirements.missing.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium">Missing:</div>
                  <ul className="text-sm list-disc list-inside">
                    {requirements.missing.map((missing, idx) => (
                      <li key={idx}>{missing}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Wand Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Wand Summary</h2>
            <div className="bg-gray-700 p-4 rounded space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Level:</span>
                  <div>{currentLevelData.label}</div>
                </div>
                <div>
                  <span className="text-gray-400">Wood:</span>
                  <div>{wood?.name || 'Not selected'}</div>
                </div>
                <div>
                  <span className="text-gray-400">Core:</span>
                  <div>{isCustomCore ? customCore || 'Custom core' : core?.name || 'Not selected'}</div>
                </div>
                <div>
                  <span className="text-gray-400">Length:</span>
                  <div>{formatLength(length)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Flexibility:</span>
                  <div>{flexibility}</div>
                </div>
                <div>
                  <span className="text-gray-400">Finish:</span>
                  <div>{FINISH_OPTIONS.find(f => f.id === finish)?.name || 'Smooth'}</div>
                </div>
              </div>
              
              {(wood || core) && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="text-sm text-gray-400 mb-2">Basic Description:</div>
                  <div className="text-sm italic mb-3">{generateWandDescription()}</div>
                  
                  {wood && core && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Detailed Analysis:</div>
                      <div className="text-sm space-y-2">
                        {generateDetailedAnalysis().map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Details */}
          {(wood || core) && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                {wood && (
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="font-medium text-gray-300">Wood</div>
                    <div className="text-sm">{wood.description}</div>
                  </div>
                )}
                
                {((wood || core) || (isCustomCore && customCore)) && (
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="font-medium text-gray-300">Core</div>
                    <div className="text-sm">
                      {isCustomCore ? 
                        `Custom core: ${customCore || 'Not specified'}` : 
                        core?.description || 'No core selected'
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* What to Expect */}
          <div>
            <h2 className="text-xl font-semibold mb-4">What to Expect</h2>
            <div className="bg-gray-700 p-4 rounded text-sm space-y-2">
              <p>• Options unlock progressively as experience increases.</p>
              <p>• Standard cores are always available (Dragon/Phoenix/Unicorn).</p>
              <p>• Specialty cores unlock based on experience and background.</p>
              <p>• Special circumstances may require staff approval.</p>
              
              <div className="mt-4">
                <div className="font-medium text-gray-300 mb-2">Experience Progression:</div>
                <div className="space-y-1 text-xs">
                  <div>• Student (11-18): 10 common woods, 3 standard cores, 9"-13"</div>
                  <div>• Young Adult (19-30): +12 rare woods, +6 specialty cores, 8"-14"</div>
                  <div>• Experienced (31-50): +9 elite woods, +6 creature cores, 7"-16"</div>
                  <div>• Elder (51+): All 31 woods, +6 elemental cores, up to 17"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
