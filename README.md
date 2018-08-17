# Offline
Post apocalypse, one programmer has to rebuild the internet

Programming has changed a lot since 2018.

Game starts with diary entries in terminal.

All terminal commands say "This command requires an internet connection".
As you expand the internet, more commands become available.

Each block is a byte. Have to put multiple bytes together for IP etc.
Components have ability to edit, destroy or create bytes.

Source components output fixed byte streams.
Some data is multiplexed over multiple inputs.

Terminal shows output sequences.

Commands:
- PIN
- SYN
- ACK
- TCP
- UDP

Act as constant values / flags that can be set instead of pure data bytes.

Tracing a line from inputs through all possible output paths

Once the player has restored the internet at the end of the game, they get access to the online version of help which allows them to see the commands for registering their own components.

Use ping to check your current score

After completing each level, automatically read a diary entry for that day.

Adding breakpoints when clicking on components, pauses when data reaches it.

Could in theory convert a circuit into a generator function that could be reused as a component in other circuits.

Hooking various output components up to ports.

Should conditionals be a type of branching component?

# TODO
- [ ] Results console
- [ ] Undo
- [ ] Condition editor
- [ ] Fix paths, split at each component
- [ ] Storyline / full screen terminal
- [ ] Prompts / messages

# Optimization
- [ ] Minify html and css.

# Stretch
- [ ] Custom interaction cursors
- [ ] Save and load programs
- [ ] Smooth movement for packets
- [ ] Selections
- [ ] Copy + paste
- [ ] Zoom + pan
