import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Prim "mo:⛔";

persistent actor {
  type HistoryEntry = {
    id: Nat;
    expression: Text;
    result: Text;
    timestamp: Int;
    pinned: Bool;
  };

  let entries = Map.empty<Principal, [HistoryEntry]>();

  let MAX_ENTRIES = 200;

  func takeFirst(arr: [HistoryEntry], n: Nat) : [HistoryEntry] {
    let size = Nat.min(arr.size(), n);
    Prim.Array_tabulate<HistoryEntry>(size, func i = arr[i])
  };

  public shared(msg) func saveEntry(expression: Text, result: Text) : async Nat {
    let caller = msg.caller;
    let now = Time.now();
    let id = Int.abs(now);
    let entry: HistoryEntry = {
      id = id;
      expression = expression;
      result = result;
      timestamp = now;
      pinned = false;
    };
    let current = switch (entries.get(caller)) {
      case null [];
      case (?arr) arr;
    };
    let combined = [entry].concat(current);
    let trimmed = if (combined.size() > MAX_ENTRIES) takeFirst(combined, MAX_ENTRIES) else combined;
    entries.add(caller, trimmed);
    id
  };

  public shared(msg) func getHistory() : async [HistoryEntry] {
    switch (entries.get(msg.caller)) {
      case null [];
      case (?arr) arr;
    }
  };

  public shared(msg) func pinEntry(id: Nat) : async Bool {
    switch (entries.get(msg.caller)) {
      case null false;
      case (?arr) {
        var found = false;
        let updated = arr.map(func(e: HistoryEntry) : HistoryEntry {
          if (e.id == id) {
            found := true;
            { id = e.id; expression = e.expression; result = e.result; timestamp = e.timestamp; pinned = not e.pinned }
          } else e
        });
        if (found) entries.add(msg.caller, updated);
        found
      };
    }
  };

  public shared(msg) func deleteEntry(id: Nat) : async Bool {
    switch (entries.get(msg.caller)) {
      case null false;
      case (?arr) {
        let filtered = arr.filter(func(e: HistoryEntry) : Bool { e.id != id });
        let deleted = filtered.size() < arr.size();
        if (deleted) entries.add(msg.caller, filtered);
        deleted
      };
    }
  };

  public shared(msg) func clearHistory() : async () {
    entries.add(msg.caller, []);
  };
}
