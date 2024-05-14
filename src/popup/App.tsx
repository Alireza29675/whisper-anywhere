/* global chrome */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FormControlLabel, Switch, TextField, Typography, Box } from '@mui/material';

function App() { 
    const [token, setToken] = useState('');
    const [prompt, setPrompt] = useState('');
    const [translationEnabled, setTranslationEnabled] = useState(false);

    // Retrieve stored data
    useEffect(() => {
        const retrieveState = async () => {
            await chrome.storage?.sync.get(['openai_token', 'openai_prompt', 'config_enable_translation'], (result) => {
                console.log('Config retrieved:', { ...result, openai_token: result.openai_token ? '***' : '' });
                if (result.openai_token) {
                    setToken(result.openai_token);
                }
                if (result.openai_prompt) {
                    setPrompt(result.openai_prompt);
                }
                if (result.config_enable_translation) {
                    setTranslationEnabled(result.config_enable_translation);
                }
            });
        };
        retrieveState();
    }, []);

    const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
        chrome.storage?.sync.set({ openai_token: event.target.value }, () => {
            console.log('Config stored:', { openai_token: event.target.value });
        });
    };

    const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(event.target.value);
        chrome.storage?.sync.set({ openai_prompt: event.target.value }, () => {
            console.log('Config stored:', { openai_prompt: event.target.value });
        });
    };

    const handleToggleTranslation = (event: ChangeEvent<HTMLInputElement>) => {
        setTranslationEnabled(event.target.checked);
        chrome.storage?.sync.set({ config_enable_translation: event.target.checked }, () => {
            console.log('Config stored:', { config_enable_translation: event.target.checked });
        });
    };

    return (
        <div>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#2c2c2c" color="white" p={3}>
                <TextField
                    fullWidth
                    label="OpenAI API Token"
                    id="token"
                    value={token}
                    onChange={handleTokenChange}
                    placeholder="sk-..."
                    size="small"
                    type={token.length > 0 ? 'password' : 'text'}
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Prompt"
                    id="prompt"
                    value={prompt}
                    onChange={handlePromptChange}
                    multiline
                    rows={4}
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                    margin="normal"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={translationEnabled}
                            onChange={handleToggleTranslation}
                            color="primary"
                        />
                    }
                    label={<Typography style={{ color: 'white' }}>Enable Translation</Typography>}
                />
            </Box>
        </div>
    );
}

export default App;