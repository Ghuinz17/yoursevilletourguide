import React, {useState, useRef} from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	FlatList,
	StyleSheet,
} from 'react-native';
import {sendMessageToRasa} from '../services/rasa';

type Message = {
	id: string;
	text: string;
	isUser?: boolean;
};

export default function ChatAssistant() {
	const [messages, setMessages] = useState<Message[]>([
		{id: '1', text: '¡Hola! ¿En qué puedo ayudarte?', isUser: false},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messageIdCounter = useRef(2);

	const sendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: `user_${messageIdCounter.current++}`,
			text: input,
			isUser: true,
		};
		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		try {
			const botTexts = await sendMessageToRasa(input);

			const botMessages: Message[] = botTexts.map((text, index) => ({
				id: `bot_${messageIdCounter.current + index}`,
				text,
				isUser: false,
			}));

			setMessages(prev => [...prev, ...botMessages]);
			messageIdCounter.current += botTexts.length;
		} catch (error) {
			const errorMessage: Message = {
				id: `error_${messageIdCounter.current++}`,
				text: 'Error al conectar con el asistente',
				isUser: false,
			};
			setMessages(prev => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const renderMessage = ({item}: {item: Message}) => (
		<View
			style={[
				styles.messageBubble,
				item.isUser ? styles.userBubble : styles.botBubble,
			]}>
			<Text
				style={[
					styles.messageText,
					item.isUser ? styles.userText : styles.botText,
				]}>
				{item.text}
			</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={messages}
				keyExtractor={item => item.id}
				renderItem={renderMessage}
				contentContainerStyle={styles.messagesList}
				inverted={false}
			/>

			<View style={styles.inputContainer}>
				<TextInput
					value={input}
					onChangeText={setInput}
					placeholder="Escribe tu mensaje..."
					style={styles.input}
					editable={!isLoading}
					onSubmitEditing={sendMessage}
				/>
				<Button
					title="Enviar"
					onPress={sendMessage}
					disabled={!input.trim() || isLoading}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	messagesList: {
		paddingVertical: 10,
	},
	messageBubble: {
		maxWidth: '80%',
		padding: 12,
		borderRadius: 18,
		marginVertical: 4,
	},
	userBubble: {
		alignSelf: 'flex-end',
		backgroundColor: '#007AFF',
	},
	botBubble: {
		alignSelf: 'flex-start',
		backgroundColor: '#E8E8E8',
	},
	messageText: {
		fontSize: 16,
	},
	userText: {
		color: 'white',
	},
	botText: {
		color: 'black',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginRight: 10,
		borderRadius: 20,
		backgroundColor: 'white',
	},
});
