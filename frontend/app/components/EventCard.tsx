import React, { memo } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Event } from "../../src/types";
import { router } from "expo-router";

type Props = {
  event: Event;
};

export default memo(function EventCard({ event }: Props) {
  return (
    <Pressable
      onPress={() => router.push(`/tabs/${event.id}`)}
      style={styles.card}
    >
      {event.imagenUrl ? (
        <Image
          source={{ uri: event.imagenUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}

      {event.category ? (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{event.category}</Text>
        </View>
      ) : null}

      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.title}>
          {event.title}
        </Text>
        <Text style={styles.date}>
          {event.date ? new Date(event.date).toLocaleDateString() : ""}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    aspectRatio: 1 / 1.2,
    maxHeight: 150,
    backgroundColor: "transparent",
  },
  placeholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#9ca3af",
  },
  tag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },
  tagText: {
    fontSize: 11,
    color: "#3730a3",
    fontWeight: "600",
  },
  body: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
});
